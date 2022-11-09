import { StorageAccountClient } from "../clients/storage-account-client.js";

const storageAccountClient = new StorageAccountClient();
export const addTerm = async (term, translation) => await storageAccountClient.addTermToStorage(term, translation);
export const listTerms = async () => await storageAccountClient.listTermsFromStorage();
