import { getCurrentMonth } from './../common/utils';
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as hbs from 'handlebars';
import { resolve, join } from 'path';
import {
  SummedEntity,
  PdfParamsAllNumbers,
  PdfParamsSummed,
  PdfReportTypes,
  TemplateNames,
} from './interfaces/pdfParameters.interface';
import * as fs from 'fs/promises';
import EntityNotFoundException from 'src/common/exceptions/EntityNotFound.exception';
import { createTempDir, createTotalSumArray } from 'src/common/utils';
import { Phone } from 'src/phone/phone.entity';
import PDFMerger = require('pdf-merger-js');
@Injectable()
export class PdfService {
  async launchBrowser() {
    return puppeteer.launch({
      executablePath: process.env.CHROME_BIN,
      headless: true,
      args: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
        '--lang=ru-RU,ru',
      ],
    });
  }

  async findTemplateHtml(templateName: string): Promise<string> {
    const filePath = resolve('src', 'pdf', 'templates', `${templateName}.hbs`);
    if (!filePath) throw new EntityNotFoundException('Template');
    return fs.readFile(filePath, 'utf-8');
  }

  async populateTemplate(
    templateName: string,
    context: PdfParamsAllNumbers | PdfParamsSummed,
  ): Promise<string> {
    const html = await this.findTemplateHtml(templateName);
    const template = hbs.compile(html);
    return template(context);
  }

  async createPdf(
    templateName: TemplateNames,
    context: PdfParamsAllNumbers,
    pdfConfig?: any,
  ): Promise<Buffer> {
    const content = await this.populateTemplate(templateName, context);

    const browser = await this.launchBrowser();
    const page = await browser.newPage();

    // Make sure to wait for the fonts to load
    await page.setContent(content, { waitUntil: 'networkidle2' });
    const pdfBuffer = await page.pdf(
      pdfConfig || {
        format: 'A4',
        printBackground: true,
      },
    );

    await browser.close();

    return pdfBuffer;
  }

  async savePdfToDisk(
    templateName: string,
    context: PdfParamsAllNumbers | PdfParamsSummed,
    dirPath: string,
  ) {
    const browser = await this.launchBrowser();

    const page = await browser.newPage();

    const content = await this.populateTemplate(templateName, context);
    await page.setContent(content, { waitUntil: 'networkidle2' });

    const absoluteFilePath = join(dirPath, `${context.name}.pdf`);
    await page.emulateMediaType('screen');
    await page.pdf({
      path: absoluteFilePath,
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
      displayHeaderFooter: true,
      footerTemplate: `<div style="text-align: right;width: 297mm;font-size: 8px;"><span style="margin-right: 1cm">${context.name} <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
      format: 'A4',
    });

    await browser.close();

    return absoluteFilePath;
  }

  async saveAllPdfToDisk(
    calculatedPhoneArrays: Phone[][],
    calculatedPhonesByGroup: SummedEntity[],
    calculatedPhonesByLocation: SummedEntity[],
  ) {
    const dirPath = await createTempDir();

    const filesArray: string[] = []

    const filteredPhoneArrays = calculatedPhoneArrays
      .filter((phonesArray: Phone[]) => !!phonesArray.length)

    for await (const phonesArray of filteredPhoneArrays) {
      const path = await this.savePdfToDisk(
        TemplateNames.ALL_NUMBERS,
        {
          array: phonesArray,
          name: phonesArray[0].invoice ?? 'test',
          sum: Number(
            phonesArray
              .reduce((sum, num) => sum + Number(num.price), 0)
              .toFixed(2),
          ),
          groupArray: createTotalSumArray(phonesArray, 'tag'),
        },
        dirPath,
      );
      filesArray.push(path)
    }

    const summedGroupsPath = await this.savePdfToDisk(
      TemplateNames.SUMMED,
      {
        array: calculatedPhonesByGroup,
        name: 'Сумирани групи',
        type: PdfReportTypes.GROUP,
      },
      dirPath,
    );
    filesArray.push(summedGroupsPath)
    const summedLocationsPath = await this.savePdfToDisk(
      TemplateNames.SUMMED,
      {
        array: calculatedPhonesByLocation,
        name: 'Сумирани локации',
        type: PdfReportTypes.LOCATION,
      },
      dirPath,
    );
    filesArray.push(summedLocationsPath)

    return { dirPath, files: filesArray };
  }

  async mergeAllPdfFiles(filePaths: string[], dirPath: string) {
    const savedPath = join(dirPath, `Фактури-${getCurrentMonth()}.pdf`);
    const merger = new PDFMerger();
    for await (const fp of filePaths) {
      await merger.add(fp)
    }
    await merger.save(savedPath);
    return savedPath;
  }
}
