const exec = require('child_process').exec;
const path = require('path');

const stage = document.querySelector('.stage');
const message = document.querySelector('.message');
const option = document.querySelector('input');

function showMessage(str) {
  message.style.display = 'block';
  message.textContent = str;
}

function execMsdf(file) {
  return new Promise((resolve, reject) => {
    const input = path.parse(file);

    if (input.ext !== '.svg') {
      showMessage('Only SVG files are supported');
      return reject();
    }

    const binaryLookup = {
      darwin: 'msdfgen.osx',
      win32: 'msdfgen.exe',
      linux: 'msdfgen.linux'
    };

    const binName = binaryLookup[process.platform];
    const binaryPath = path.join(__dirname, 'msdfgen', process.platform, binName);

    const ouputFile = path.join(input.dir, `${input.name}_msdf.png`);

    // -autoframe -format png -keeporder -pxrange 4 -size 128 128
    const options = option.value;

    let command = `${binaryPath} msdf -svg ${file} -o ${ouputFile} ${options}`;

    exec(command, (err, stdout, stderr) => {
      if (err || stderr) {
        showMessage(err || stderr);
        return reject();
      }

      return resolve();
    });
  });
}

function dragOver() {
  stage.style.opacity = 0.4;
  message.style.display = 'none';
}

function dragEnd() {
  stage.style.opacity = 1.0;
}

document.addEventListener('drop', async (event) => {
  event.preventDefault();
  event.stopPropagation();
  dragOver();

  document.body.classList.add('loading');

  let ps = [];
  for (const f of event.dataTransfer.files) {
    ps.push(execMsdf(f.path));
  }

  try {
    await Promise.all(ps);
  } catch(e) {

  }

  document.body.classList.remove('loading');

  dragEnd();
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragOver();
});

document.addEventListener('dragenter', (event) => {
  dragOver();
});

document.addEventListener('dragleave', (event) => {
  dragEnd();
});