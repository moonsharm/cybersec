document.getElementById("file-input").addEventListener("change", () => {
  // Очищаем предыдущие результаты при выборе нового файла
  document.getElementById("original-metadata-h").textContent = '';
  document.getElementById("cleaned-metadata-h").textContent = '';
  document.getElementById("original-metadata").textContent = '';
  document.getElementById("cleaned-metadata").textContent = '';
  document.getElementById("download-button").style.display = "none"; // Скрываем кнопку скачивания
  document.getElementById("original-metadata").style.display = "none";
  document.getElementById("cleaned-metadata").style.display = "none";
});

document.getElementById("process-file-button").addEventListener("click", async (event) => {
    event.preventDefault();

    document.getElementById("original-metadata").style.display = "block";
    document.getElementById("cleaned-metadata").style.display = "block";
    document.getElementById("original-metadata-h").textContent = 'Метаданные оригинального файла:';
    document.getElementById("cleaned-metadata-h").textContent = 'Метаданные очищенного файла:';
    document.getElementById("original-metadata").textContent = 'Загрузка данных...';
    document.getElementById("cleaned-metadata").textContent = 'Загрузка данных...';

    const formData = new FormData();
    const fileInput = document.getElementById("file-input");

    if (!fileInput.files.length) {
        alert("Выберите файл для загрузки!");
        return;
    }

    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("/api/process-file", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Ошибка при отправке на сервер");
        }

        const data = await response.json();

        const hiddenKeys = [
          "Rendering Parameters",
          "Intrinsic Matrix",
          "Inverse Lens Distortion Coefficients",
          "Lens Distortion Coefficients",
          "Region Area Y",
          "Region Area W",
          "Region Area X",
          "Region Area H",
          "Region Area Unit",
          "Region Type",
          "Chromatic Adaptation",
          "Directory"
      ];

      function filterMetadata(metadata) {
          return metadata
              .split("\n") // Разбиваем на строки
              .filter(line => !hiddenKeys.some(key => line.startsWith(key))) // Убираем ненужные параметры
              .join("\n"); // Собираем обратно
      }

      // Фильтруем оригинальные и очищенные метаданные
      document.getElementById("original-metadata").textContent = filterMetadata(data.originalMetadata);
      document.getElementById("cleaned-metadata").textContent = filterMetadata(data.cleanedMetadata);

        // Делаем кнопку скачивания активной
        const downloadButton = document.getElementById("download-button");
        downloadButton.style.display = "inline-block";
        downloadButton.onclick = () => {
            const link = document.createElement("a");
            link.href = `/${data.downloadUrl}`;
            link.download = "cleaned_file.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

const quiz = [
  {
    question: "Что такое метаданные?",
    answers: ["Личные данные пользователя", "Вредоносный код, встроенный в файл", "Дополнительная информация о файле, не видимая сразу", "Расширение файла"],
    correct: 2
  },
  {
    question: "Какие данные чаще всего можно найти в метаданных фотографии?",
    answers: ["Пароль от Wi-Fi", "Геолокация, модель камеры, дата съёмки", "Имя владельца компьютера и логин", "Разрешение, имя файла"],
    correct: 3
  },
  {
    question: "Почему метаданные могут быть опасны?",
    answers: ["Они могут раскрыть личную информацию", "Они делают файл тяжелее", "Через них можно заразить устройство вирусом", "Они удаляются при отправке файла"],
    correct: 0
  },
  {
    question: "Какие типы файлов чаще всего содержат метаданные?",
    answers: ["Архивы (.zip, .rar)", "Исполняемые файлы (.exe)", "Все файлы одинаково содержат метаданные", "Документы, изображения, видео"],
    correct: 3
  },
  {
    question: "Какой способ менее всего подходит для удаления метаданных?",
    answers: ["Очистка через свойства", "Очистка через exifTool", "Очистка через специальные сайта", "Очистка путем передачи файла по сети"],
    correct: 3
  }
];

let currentQuestion = 0;
let selectedAnswers = Array(quiz.length).fill(null);

const modal = document.getElementById("quizModal");
const qText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const counter = document.getElementById("question-counter");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const result = document.getElementById("test-result");

function openModal() {
  modal.style.display = "block";
  currentQuestion = 0;
  selectedAnswers = Array(quiz.length).fill(null);

  // Сброс текста и отображение кнопок
  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";

  // Убедимся, что кнопки и счётчик отображаются
  counter.textContent = "";
  qText.textContent = "";
  answersContainer.innerHTML = "";

  renderQuestion();
}

function closeModal() {
  modal.style.display = "none";
  qText.textContent = "";
  answersContainer.innerHTML = "";
  counter.textContent = "";
  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";
}

function renderQuestion() {
  result.textContent = ``
  const q = quiz[currentQuestion];
  qText.textContent = q.question;
  answersContainer.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const id = `answer_${index}`;
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="answer" id="${id}" value="${index}" ${
      selectedAnswers[currentQuestion] === index ? "checked" : ""
    }> ${answer}`;
    answersContainer.appendChild(label);
  });

  counter.textContent = `${currentQuestion + 1} / ${quiz.length}`;
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent = currentQuestion === quiz.length - 1 ? "Завершить" : "Вперёд";
}

prevBtn.onclick = () => {
  saveAnswer();
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
};

nextBtn.onclick = () => {
  saveAnswer();
  if (currentQuestion < quiz.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResults();
  }
};

function saveAnswer() {
  const selected = document.querySelector("input[name='answer']:checked");
  if (selected) selectedAnswers[currentQuestion] = parseInt(selected.value);
}

function showResults() {
  let score = 0;
  quiz.forEach((q, i) => {
    if (selectedAnswers[i] === q.correct) score++;
  });
  qText.textContent = ``;
  result.textContent = `Вы набрали ${score} из ${quiz.length} баллов.`;
  answersContainer.innerHTML = "";
  counter.textContent = "";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
}