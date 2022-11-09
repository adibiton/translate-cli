# TRANSLATOR-CLI

- Translate text based on azure cognitive services.
- Upload the words + translation to Azure storage account.

### Project setup

- Register to [Azure cognitive services](https://azure.microsoft.com/en-us/free/cognitive-services/) and get an api key.
- Create a new .env file (you can copy .env-example) and fill the api key.
- Create a new [storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create) in Azure and assign it's name in the .env file (STORAGE_ACCOUNT_NAME)
- Create a new [table](https://learn.microsoft.com/en-us/azure/storage/tables/table-storage-quickstart-portal) in the above storage account and assign it's name in the .env file (STORAGE_ACCOUNT_TABLE_NAME)
- Add permission to write to the table:
  - Fetch your user_id from AzureAD (most easily in the Azure portal)
  - Get the resource Id of the new table, it should be something like:

```
  /subscriptions/<sub_id>/resourcegroups/<rg_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>/tableServices/default/tables/<table_name>
```

- Run the following command (using azure cli)

```
  az role assignment create --role "Storage Table Data Contributor" --assignee <user_id>  --scope /subscriptions/<sub_id>/resourcegroups/<rg_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>/tableServices/default/tables/<table_name>"
```

### How to run this project

- From command line:
  - Run `npm install`
  - Run `node index.js <phrase>`
  - You can create a symlink in the global folder that links to the package where the npm link command was executed
    by running `npm link` and then `translate <phrase>` from anywhere

## Adding permissions

we are using azure storage account as a data source for the translated words.
