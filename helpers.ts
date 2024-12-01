// credentialHelper.ts
import fs from 'fs';
import ENV from './env';

interface Credentials {
    username: string;
    password: string;
}

export function getRandomCredentials(): Credentials {
    const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8')).loginUserNames;
    const usernames = Object.keys(credentials).filter(key => key.startsWith('username'));
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];

    return {
        username: credentials[randomUsername],
        password: credentials.password
    };
}

export function getResourcesPath(): string {
    return ENV.RESOURCES_PATH?.toString() || '';
}
