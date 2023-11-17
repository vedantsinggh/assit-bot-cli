import OpenAI from "openai";
import { readFileSync } from "fs";
import { createInterface } from "readline";
import { _key } from "./key.js"
import axios from "axios";

var msg = []
var promptsFiles = ["intro.txt", "usage.txt", "will.txt", "habits.txt"]
for (let name of promptsFiles) {
	let content = readFileSync("files\\" + name, 'utf8');
	msg.push({"role": "system", "content": content});
}

async function getJsonResponse(message) {
	msg.push({"role": "user", "content": message});
    try {
		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				"model": "gpt-3.5-turbo-1106",
				"response_format": { "type": "json_object" },
				"messages": msg
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer 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`,
				},
			}
			);
			
			if (response.data && response.data.choices && response.data.choices.length > 0) {
				msg.push({role: "assistant", content: response.data.choices[0].message.content.toString().trim()});
				return response.data.choices[0].message.content.toString().trim();
			} else {
				throw new Error('No response from ChatGPT');
			}
		} catch (error) {
			console.error(error);
			return 'An error occurred while getting response from ChatGPT';
		}
  }

// const openai = new OpenAI({apiKey: _key,});
// async function getCLIresponse(query) {
	// 	msg.push({"role": "user", "content": query});
	// 	const stream = await openai.chat.completions.create({
		// 		model: 'gpt-3.5-turbo',
		// 		messages: msg,
		// 		stream: true,
		// 	});
  
//   let result = '';
//   for await (const chunk of stream) {
// 	  let content = chunk.choices[0]?.delta?.content || '';
// 	  result += content;
// 	  var res = process.stdout.write(content);
//   }

// 	console.log("\n\n")
// 	msg.push({"role": "assistant", "content": result});

// }

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

const getInput = () => {
	rl.question('Enter something (or type "exit" to quit): ', async (input) => {
		if (input.toLowerCase() === 'exit') {
		rl.close();} else {
		const a = await getJsonResponse(input); //replace getJsonResponse() with getCLIresponse() for using CLI bot
		console.log(a);
		getInput()
	  }
	});
  };
  
getInput(); 
//cli-test ends
