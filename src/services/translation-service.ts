import "dotenv/config";
import axios from "axios";

const azureTranslatorApiKey = process.env.OCP_APIM_SUBSCRIPTION_KEY;
const azureCognitivePrefixURL = "https://api.cognitive.microsofttranslator.com";

enum ResponseStatus {
  Failure,
  Success,
}
interface TranslationResponse {
  text: string;
  status: ResponseStatus;
}
async function detect(phrase: string) {
  const detectUrl = `${azureCognitivePrefixURL}/Detect?api-version=3.0`;
  let response;
  try {
    response = await axios(buildRequest(detectUrl, phrase));
  } catch (e) {
    console.error(e);
  } finally {
    return parseDetectResponse(response);
  }
}

async function translate(phrase: string): Promise<TranslationResponse> {
  const detectedLanguage = await detect(phrase);
  const translateToLanguage = detectedLanguage === "en" ? "he" : "en";
  const translateUrl = `${azureCognitivePrefixURL}/translate?api-version=3.0&to=${translateToLanguage}`;
  let response;
  try {
    response = await axios(buildRequest(translateUrl, phrase));
  } catch (e) {
    console.error(e);
  } finally {
    return parseTranslateResponse(phrase, response);
  }
}

const parseDetectResponse = (response) => response?.data[0]?.language ?? "en";

const parseTranslateResponse = (phrase, response): TranslationResponse => {
  const translatedPhrase = response?.data[0].translations[0].text;
  const defaultResponse = `Can't find a translation to the input: ${phrase}`;
  return translatedPhrase && translatedPhrase !== phrase
    ? { status: ResponseStatus.Success, text: translatedPhrase }
    : { status: ResponseStatus.Failure, text: defaultResponse };
};

const buildRequest = (url: string, phrase: string): object => ({
  url,
  data: [{ Text: `${phrase}` }],
  method: "Post",
  headers: { "Ocp-Apim-Subscription-Key": azureTranslatorApiKey, "Content-Type": "application/json" },
});

export { translate, TranslationResponse, ResponseStatus };
