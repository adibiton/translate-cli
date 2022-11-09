import "dotenv/config";

import { DefaultAzureCredential, ErrorResponse } from "@azure/identity";
import { TableClient } from "@azure/data-tables";

const accountName = process.env.STORAGE_ACCOUNT_NAME;
const tableName = process.env.STORAGE_ACCOUNT_TABLE_NAME;

const credential = new DefaultAzureCredential();

interface IStorageAccountClient {
  addTermToStorage: (term: string, translation: string) => Promise<void> | ErrorResponse;
  listTermsFromStorage: () => Promise<string[]>;
}

export class StorageAccountClient implements IStorageAccountClient {
  private tableClient: TableClient;
  constructor() {
    this.tableClient = new TableClient(`https://${accountName}.table.core.windows.net`, tableName, credential);
  }
  async addTermToStorage(term: string, translation: string) {
    const termEntity = {
      partitionKey: "P1",
      rowKey: term,
      term,
      translation,
    };
    try {
      await this.tableClient.createEntity(termEntity);
    } catch (error) {
      return error?.message;
    }
  }

  async listTermsFromStorage() {
    let entitiesIter = this.tableClient.listEntities();
    let i = 1;
    let entities: string[] = [];
    for await (const entity of entitiesIter) {
      entities.push(`Term: ${entity.term}, Translation: ${entity.translation}`);
      i++;
    }
    return entities;
  }
}
