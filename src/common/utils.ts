import * as fs from 'fs/promises';
import * as AdmZip from 'adm-zip';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import * as os from 'os';
import { Months } from './enums/months.enum';
import { Phone } from 'src/phone/phone.entity';

export const createTotalSumArray = <T extends Record<string, any>>(
  fromArray: T[],
  attributeName: string,
) => {
  const object = fromArray.reduce<{ [key: string]: any }>((dict, cur) => {
    if (!cur[attributeName]) {
      return dict;
    }
    if (cur[attributeName]['name'] && !dict[cur[attributeName]['name']]) {
      return {
        ...dict,
        [cur[attributeName]['name']]: Number(cur.price),
      };
    }
    return {
      ...dict,
      [cur[attributeName]['name'] ?? ""]:
        dict[cur[attributeName]['name'] ?? ""] + Number(cur.price),
    };
  }, {});
  return Object.keys(object).map((k) => ({
    name: k,
    sum: Number(Number(object[k]).toFixed(2)),
  }));
};

export const createCalculatedLocationAndTagArrays = (calculatedPhones: Phone[]) => {
  const createLocationArrays = calculatedPhones.reduce<Record<string, Phone[]>>((prev, next) => {
    if (!prev[next.location.name]) {
      return {...prev, [next.location.name]: [next]} 
    }
    return {...prev, [next.location.name]: [...prev[next.location.name], next]} 
  },{})

  return Object.keys(createLocationArrays).map((key) => {
    const phonesWithoutGroup = createLocationArrays[key].filter((phone) => !phone.tag)
    const transformedPhonesWithoutTag = phonesWithoutGroup.map((phone) => ({name: phone.name, sum: Number(phone.price)}))
    const groupSums = createTotalSumArray(createLocationArrays[key], 'tag')
    return {name: key, sums: [...transformedPhonesWithoutTag, ...groupSums]}
  })
}

export const isZipFile = (file: Express.Multer.File) => {
  const zipMimeTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'multipart/x-zip',
    'application/zip-compressed',
    'application/x-zip',
  ];
  if (zipMimeTypes.includes(file.mimetype)) {
    return true;
  }
  return false;
};

export const saveFile = async (file: Express.Multer.File): Promise<string> => {
  const filepath = `/tmp/${new Date().getTime()}_${file.originalname}`;
  await fs.writeFile(filepath, file.buffer);
  return filepath;
};

export const unzipFile = async (filepath: string): Promise<string> => {
  const zip = new AdmZip(filepath);
  const outputDir = `/tmp/${path.parse(filepath).name}_extracted`;
  zip.extractAllTo(outputDir);
  return outputDir;
};

export const getFiles = async (outputDir: string): Promise<string[]> => {
  const contents = await fs.readdir(outputDir, { withFileTypes: true });
  const files = await Promise.all(
    contents.map((content) => {
      const res = path.resolve(outputDir, content.name);
      return content.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
};

export const removeDir = async (dirPath: string) => {
  await fs.rm(dirPath, {
    recursive: true,
    force: true,
  });
};

export const removeZipAndDir = async (
  filepath: string,
  dir: string,
): Promise<void> => {
  await fs.unlink(filepath);
  await removeDir(dir);
};

export const openJson = async (filePath: string) => {
  const pathToFile = path.resolve(filePath);
  const openedFile = await fs.readFile(pathToFile);
  return JSON.parse(openedFile.toString());
};

export const createTempDir = async (): Promise<string> => {
  const dirPath = path.join(os.tmpdir(), uuid());
  await fs.mkdir(dirPath);
  return dirPath;
};

export const getCurrentMonth = () => {
  return Months[new Date().getMonth()];
};
