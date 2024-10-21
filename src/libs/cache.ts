import Redis from "ioredis";
import { REDIS_URI_CONNECTION } from "../config/redis";
import util from "util";
import * as crypto from "crypto";

const redis = new Redis(REDIS_URI_CONNECTION);

redis.on("error", (err) => {
  console.error("Erro ao conectar ao Redis:", err.message);
});


redis.on("connect", () => {
  console.log("Conectado ao Redis com sucesso.");
});
function encryptParams(params: any) {
  const str = JSON.stringify(params);
  return crypto.createHash("sha256").update(str).digest("base64");
}

export async function setFromParams(
  key: string,
  params: any,
  value: string,
  option?: string,
  optionValue?: string | number
) {
  const finalKey = `${key}:${encryptParams(params)}`;
  try {
    if (option !== undefined && optionValue !== undefined) {
      return await set(finalKey, value, option, optionValue);
    }
    return await set(finalKey, value);
  } catch (error) {
    console.error(`Erro ao definir a chave ${finalKey}:`, error.message);
  }
}

export async function getFromParams(key: string, params: any) {
  const finalKey = `${key}:${encryptParams(params)}`;
  try {
    return await get(finalKey);
  } catch (error) {
    console.error(`Erro ao obter a chave ${finalKey}:`, error.message);
  }
}

export async function delFromParams(key: string, params: any) {
  const finalKey = `${key}:${encryptParams(params)}`;
  try {
    return await del(finalKey);
  } catch (error) {
    console.error(`Erro ao deletar a chave ${finalKey}:`, error.message);
  }
}

export async function set(
  key: string,
  value: string,
  option?: string,
  optionValue?: string | number
) {
  const setPromisefy = util.promisify(redis.set).bind(redis);
  try {
    if (option !== undefined && optionValue !== undefined) {
      return await setPromisefy(key, value, option, optionValue);
    }
    return await setPromisefy(key, value);
  } catch (error) {
    console.error(`Erro ao definir a chave ${key}:`, error.message);
  }
}

export async function get(key: string) {
  const getPromisefy = util.promisify(redis.get).bind(redis);
  try {
    return await getPromisefy(key);
  } catch (error) {
    console.error(`Erro ao obter a chave ${key}:`, error.message);
  }
}

export async function getKeys(pattern: string) {
  const getKeysPromisefy = util.promisify(redis.keys).bind(redis);
  try {
    return await getKeysPromisefy(pattern);
  } catch (error) {
    console.error(`Erro ao obter chaves com o padrão ${pattern}:`, error.message);
  }
}

export async function del(key: string) {
  const delPromisefy = util.promisify(redis.del).bind(redis);
  try {
    return await delPromisefy(key);
  } catch (error) {
    console.error(`Erro ao deletar a chave ${key}:`, error.message);
  }
}

export async function delFromPattern(pattern: string) {
  try {
    const all = await getKeys(pattern);
    for (let item of all) {
      await del(item);
    }
  } catch (error) {
    console.error(`Erro ao deletar chaves com o padrão ${pattern}:`, error.message);
  }
}

export const cacheLayer = {
  set,
  setFromParams,
  get,
  getFromParams,
  getKeys,
  del,
  delFromParams,
  delFromPattern
};
