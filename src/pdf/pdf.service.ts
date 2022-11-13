import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as hbs from 'handlebars';
import { resolve, join } from 'path';
import {
  PdfParamsAllNumbers,
  TemplateNames,
} from './interfaces/pdfParameters.interface';
import * as fs from 'fs/promises';
import EntityNotFoundException from 'src/common/exceptions/EntityNotFound.exception';
import { createTempDir } from 'src/common/utils';

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
    context: PdfParamsAllNumbers,
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

  async savePdfToDisk(templateName: string, context: PdfParamsAllNumbers) {
    const tempDir = await createTempDir();

    const browser = await this.launchBrowser();

    const page = await browser.newPage();

    const content = await this.populateTemplate(templateName, context);
    await page.setContent(content, { waitUntil: 'networkidle2' });

    const absoluteFilePath = join(tempDir, `${templateName}.pdf`);
    await page.pdf({
      path: absoluteFilePath,
      format: 'A4',
    });

    await browser.close();

    return absoluteFilePath;
  }
}
