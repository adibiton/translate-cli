#!/usr/bin/env node
import { translate, ResponseStatus } from "./services/translation-service.js";
import { addTerm, listTerms } from "./services/storage-service.js";
import argv from "minimist";

const args = argv(process.argv.slice(2));

export async function main(argv) {
  if (args?.list) {
    const terms = await listTerms();
    console.log(terms);
  } else {
    const phrase = argv._.join(" ");
    const response = await translate(phrase);
    if (response.status === ResponseStatus.Success) {
      await addTerm(phrase, response.text);
      console.log(response.text);
    } else {
      console.error(response.response.text);
    }
  }
}

main(args).then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  }
);
