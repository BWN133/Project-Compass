/* 
Prompting Tactics (that are helpful in this project):
1. Use deliminaters to avoid prompt injection
2. Ask for structured output eg. .json
3. Give instructions in steps
*/

import * as OpenAI from "openai";
import env from "./validateEnv";

const configuration = new OpenAI.Configuration({
	apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAI.OpenAIApi(configuration);

export default function getResponse(title: string, description: string): Promise<import("axios").AxiosResponse<OpenAI.CreateChatCompletionResponse, unknown>> {
	const messages: OpenAI.ChatCompletionRequestMessage[] = [
		{
			role: OpenAI.ChatCompletionRequestMessageRoleEnum.User,
			content: `Hi GPT, I'm working on a project called {{${title}}},  with name in double curly brackets. The description is also provided in double curly brackets below:\n{{${description}}}\nI hope you can do the following for me:\n1. Create a summary for the description if it contains more than 20 words. Otherwise, leave it as it is\n2. Divide the projects into separate tasks that I can complete step by step, along with description for each task\n3. identify possible challenge(s) in each task\n4. suggest resources and/or tools that are helpful along the way. \nNote that "None" is a valid answer for 3 and 4, but please elaborate as much as possible if any concrete answer is given. For instance, you might want to explain what causes the challenge(s), and/or introduce the tools you mention. Be sure respond only in .json format with the following keys for each task entry: name, description, challenges, resources, tools.`
		}
	]
	return openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: messages,
		temperature: 0
	});
}