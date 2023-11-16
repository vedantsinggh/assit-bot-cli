import OpenAI from "openai";
import { readFileSync } from "fs";
import { createInterface } from "readline";
import { key } from "./key"

const openai = new OpenAI({
	apiKey: key,});

var msg = []
var promptsFiles = ["intro.txt", "usage.txt", "will.txt"]
for (let name of promptsFiles) {
	let content = readFileSync("files\\" + name, 'utf8');
	msg.push({"role": "system", "content": content});
}

async function askGPT(query) {
	msg.push({"role": "user", "content": query});
	const stream = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: msg,
		stream: true,
	});
  
  let result = '';
  for await (const chunk of stream) {
	  let content = chunk.choices[0]?.delta?.content || '';
	  result += content;
	  var res = process.stdout.write(content);
  }

	console.log("\n\n")
	msg.push({"role": "assistant", "content": result});

}

//cli-test start
const rl = createInterface({
	input: process.stdin,
	output: process.stdout
  });

  const getInput = () => {
	rl.question('Enter something (or type "exit" to quit): ', async (input) => {
	  if (input.toLowerCase() === 'exit') {
		rl.close();
	  } else {
		const a = await askGPT(input);
		getInput()
	  }
	});
  };
  
getInput(); 
//cli-test ends
