import { PdfService } from './../pdf/pdf.service';
import { HistoryRecordService } from './../history-record/history-record.service';
import {
  createTotalSumArray,
  getCurrentMonth,
  getFiles,
  openJson,
  removeDir,
  removeZipAndDir,
  saveFile,
  unzipFile,
} from './../common/utils';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import EntityNotFoundException from 'src/common/exceptions/EntityNotFound.exception';
import IncorrectFileException from 'src/common/exceptions/IncorrectFile.exception';
import { isZipFile } from 'src/common/utils';
import { Charge, InvoiceCharge } from './dto/charge.dto';
import CreatePhoneDto from './dto/createPhone.dto';
import { Phone } from './phone.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { basename } from 'path';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: EntityRepository<Phone>,
    private readonly historyRecordService: HistoryRecordService,
    private readonly pdfService: PdfService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Phone[]> {
    return this.phoneRepository.findAll({ populate: ["tag", "location"] });
  }

  async findOne(id: number): Promise<Phone> {
    const phone = await this.phoneRepository.findOne({
      id,
    });
    if (!phone) {
      throw new EntityNotFoundException('Phone');
    }
    return phone;
  }

  async create(data: CreatePhoneDto): Promise<Phone> {
    const newPhone = await this.phoneRepository.create(data);
    await this.phoneRepository.persistAndFlush(newPhone);
    return newPhone;
  }

  async update(id: number, data: CreatePhoneDto): Promise<Phone> {
    const existingPhone = await this.findOne(id);
    wrap(existingPhone).assign(data);
    await this.phoneRepository.persistAndFlush(existingPhone);
    return existingPhone;
  }

  async delete(id: number): Promise<Phone> {
    const phone = await this.findOne(id);
    this.phoneRepository.removeAndFlush(phone);
    return phone;
  }

  async calculatePrices(charges: Charge[]): Promise<Phone[]> {
    const phones = await this.findAll();

    const newPhones: Phone[] = [];

    charges.forEach((charge) => {
      const newCharge = new InvoiceCharge(charge);
      const number = phones.find((n) => n.number === newCharge.msisdn);
      if (number) {
        newPhones.push({
          ...number,
          price: newCharge.price,
          invoice: newCharge.invoice,
        });
      }
    });

    return newPhones;
  }

  async parseInvoiceZip(file: Express.Multer.File): Promise<Charge[][]> {
    if (!isZipFile(file)) throw new IncorrectFileException();

    const savedFile = await saveFile(file);
    const unzippedDir = await unzipFile(savedFile);
    const invoiceFiles = await getFiles(unzippedDir);

    const parsedInvoices: Charge[][] = await Promise.all(
      invoiceFiles.map(
        async (invoiceFile) =>
          (
            await openJson(invoiceFile)
          ).summaryCharges.summaryCharge,
      ),
    );

    await removeZipAndDir(savedFile, unzippedDir);
    return parsedInvoices;
  }

  async handleZipUpload(file: Express.Multer.File, user: User) {
    if (!user?.email) {
      throw new UnauthorizedException('User has no email');
    }

    const invoicesArrays = await this.parseInvoiceZip(file);

    const calculatedPhoneArrays = await Promise.all(
      invoicesArrays.map(async (array) => await this.calculatePrices(array)),
    );

    const calculatedPhones = Array.prototype.concat(...calculatedPhoneArrays);
    const calculatedPhonesByGroup = createTotalSumArray(
      calculatedPhones,
      'tag',
    );
    const calculatedPhonesByLocation = createTotalSumArray(
      calculatedPhones,
      'location',
    );

    // Create history records if they don't exist
    if (!this.historyRecordService.hasRecordedMonth(new Date())) {
      await this.historyRecordService.createMany(calculatedPhones);
    }

    const { dirPath, files } = await this.pdfService.saveAllPdfToDisk(
      calculatedPhoneArrays,
      calculatedPhonesByGroup,
      calculatedPhonesByLocation,
    );

    const finalFilePath = await this.pdfService.mergeAllPdfFiles(
      files,
      dirPath,
    );

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Фактури ${getCurrentMonth()}`,
      from: this.configService.get('SENDER'),
      text: `Фактури ${getCurrentMonth()}`,
      html: `<b>Фактури ${getCurrentMonth()}</b>`,
      attachments: [
        {
          path: finalFilePath,
          filename: basename(finalFilePath),
          contentDisposition: 'attachment',
        },
      ],
    });

    await removeDir(dirPath);
  }
}
