require('dotenv').config();

const fs = require('fs')
const path = require('path')
const { getCompletion, genImages } = require('./apis');
const { unique, base64ToFile, genRandomFileName, checkDirExist, excludeSpecialChar } = require('./utils');
const { words } = require('./words');

const docsPath = path.resolve(__dirname, 'docs')
const imagesPath = path.resolve(docsPath, 'images')

main();

async function main() {
  const word = getWord();

  // 检查、创建 images 目录
  checkDirExist(imagesPath)

  try {
    const prompt = await genPrompt(word);
    const title = await genTitle(prompt);

    const docPath = path.resolve(docsPath, `${title}.md`)
    if (fs.existsSync(docPath)) return;

    let content = `# ${title}\n\n${prompt}\n\n`

    const { data } = await genImages(prompt, n = 3)

    data.forEach((item, index) => {
      const b64 = item['b64_json']
      const imgName = genRandomFileName('.png')
      const imgPath = path.resolve(imagesPath, imgName)
      base64ToFile(b64, imgPath)

      content += `![${title}-${index}](./images/${imgName})\n\n`
    })

    fs.writeFileSync(docPath, content, 'utf-8')
  } catch (error) {
    console.log(error);
  }
}

async function genPrompt(word) {
  const fragments = [`请基于我给你的内容写一段 DALL·E 的 Prompt，这段 Prompt 中需要多次出现我给你的内容，你不需要告诉我 DALL·E 是什么，也不能包含 DALL·E 等字眼，只需要告送我这段 Prompt，我给你的内容是：${word}`];

  const { choices } = await getCompletion([
    {
      role: 'user',
      content: fragments.join('')
    }
  ]);

  return choices[0].message.content;
}

async function genTitle(prompt) {
  const fragments = [`请基于我给你的内容生成一个 Title，Title 中不能包含文件命不允许存在的特殊字符，只需要告送我 Title，我给你的内容是：${prompt}`];

  const { choices } = await getCompletion([
    {
      role: 'user',
      content: fragments.join('')
    }
  ]);

  return excludeSpecialChar(choices[0].message.content)
}

function getWord() {
  const _words = unique(words);
  const randomIndex = Math.floor(Math.random() * _words.length);
  return _words[randomIndex];
}
