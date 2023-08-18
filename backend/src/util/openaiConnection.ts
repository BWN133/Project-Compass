import * as OpenAI from 'openai'
import env from './validateEnv'

/* 
Prompting Tactics (that are helpful in this project):
1. Use deliminaters to avoid prompt injection
2. Ask for structured output eg. .json
3. Give instructions in steps
*/

const configuration = new OpenAI.Configuration({ apiKey: env.OPENAI_API_KEY })
const openai = new OpenAI.OpenAIApi(configuration)

export default async function generateProjectDetails(name: string, description: string) {
    const messages: OpenAI.ChatCompletionRequestMessage[] = [
        {
            role: OpenAI.ChatCompletionRequestMessageRoleEnum.User,
            content: `Hi GPT, I'm working on a project called {{${name}}},  with name in double curly brackets. Its description is also provided in double curly brackets below:\n{{${description}}}\nPlease do the following for me:\n1. Write a 20-word summary for the description if it contains more than 20 words. Otherwise, the summary will be the description.\n2. Divide the project into separate tasks that I can complete step by step, along with the description of each task\n3. identify possible challenge(s) in each task\n4. suggest resources and/or tools that are helpful along the way. \nNote that "None" is a valid answer for 3 and 4, but please aim for 500 words if any concrete answer is given. For instance, you might want to explain what causes the challenge(s), and/or introduce the tools you mention along with how to use them. Be sure to respond only in .json format with keys \`tasks\` and \`summary\`. For each task entry, use the following keys: \`name\`, \`description\`, \`challenges\`, \`resources\`, and \`tools\`.`
        }
    ]
    const textPromise = openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0,
        max_tokens: 2700,
    })
    const imagePromise = openai.createImage({
        prompt: `Design the logo for a project called {{${name}}}, with name in double curly brackets. Its description is also provided in double curly brackets below:\n{{${description}}}`,
        n: 1,
        size: '256x256',
    })
    const [textRes, imageRes] = await Promise.all([textPromise, imagePromise])
    const projectStr = textRes.data.choices[0].message?.content
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const project = JSON.parse(projectStr!)
    project.logo = imageRes.data.data[0].url

    return project
}