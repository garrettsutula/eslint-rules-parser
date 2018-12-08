const fs = require('fs');
const eslint = require('eslint');
const esprima = require('esprima');

const ruleDocs = [];
const ruleNames = Object.keys(eslint.linter.rules._rules);
const rulePaths = Object.values(eslint.linter.rules._rules);

const rules = rulePaths.map((path, index) => {
  return readFile(path);
});

Promise.all(rules)
  .then((result) =>{
    fs.writeFile('rules.json', JSON.stringify(result), (err) => {
      if (err) throw err;
      console.log('rules.json saved successfully')
    });
  })


function readFile(path) {
  return new Promise((resolve, reject) =>{
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      const file = data.toString('ascii');
      const result = esprima.parseScript(file);
      const type = result.body[result.body.length - 1].expression.right.properties[0].value.properties[0].value.value ? result.body[result.body.length - 1].expression.right.properties[0].value.properties[0].value.value : null;
      const description = result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[0].value.value ? result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[0].value.value : null;
      const category = result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[1].value.value ? result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[1].value.value : null;
      const recommended = result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[2].value.value ? result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[2].value.value : null;
      const url = result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[3].value.value ? result.body[result.body.length - 1].expression.right.properties[0].value.properties[1].value.properties[3].value.value : null;
      resolve({
        type,
        description,
        category,
        recommended,
        url,
      });
    });
  });
}
