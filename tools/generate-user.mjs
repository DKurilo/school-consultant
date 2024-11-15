import {randomInt, pbkdf2Sync} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const main = async () => {
  const email = process.argv[2];
  const fileName = Buffer.from(email).toString('base64url');
  const filePath = resolve(import.meta.dirname, '..', 'packages', 'api-fast-and-dirty', 'storage', fileName);
  const abc = 'abcdefghijclmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}[]|\\;:\'"<>,.?/`~';
  const password = new Array(32).fill(0).map(() => abc[randomInt(0, abc.length - 1)]).join('');
  const salt = new Array(32).fill(0).map(() => abc[randomInt(0, abc.length - 1)]).join('');
  const hash = pbkdf2Sync(password, salt, 10000, 128, 'sha512').toString('hex');
  const user = {
    email,
    passHash: hash,
    passSalt: salt,
    children: []
  };
  writeFile(filePath, JSON.stringify(user, null, '  '));
  console.log(`password for user ${email} is ${password}`);
}

main();
