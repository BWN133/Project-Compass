
import * as OpenAI from "openai";
import env from "./validateEnv";

const configuration = new OpenAI.Configuration({
	apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAI.OpenAIApi(configuration);

export default function getResponse(title: string, description: string): Promise<import("axios").AxiosResponse<OpenAI.CreateChatCompletionResponse, unknown>> {
	const messages: OpenAI.ChatCompletionRequestMessage[] = [
		{
			'role': OpenAI.ChatCompletionRequestMessageRoleEnum.User,
			'content': `Hi GPT, I'm working on a task called ${title}. Here's the description of the task:\n\t${description}\nCan you break it down into steps for me? I also want to learn about possible challenges that I might face. Can you identify and suggest ways to overcome them? It would be great if you could also suggest resources and tools that I can use.`
		}
	]
	return openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: messages,
		temperature: 0
	});
}