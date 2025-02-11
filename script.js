/* eslint-disable no-undef */
const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('header');
const mainElement = document.querySelector('main');

const themeSwitch = document.querySelector('.theme-switch');
const themeIcon = document.querySelector('.theme-icon path');

const dictionaryAppLogo = document.querySelector('.dictionary-app-logo');
const dictionaryAppLogoPaths = document.querySelectorAll(
  '.dictionary-app-logo path',
);

const fontSelectionButton = document.querySelector('.font-selection-button');
const fontSelectionButtonText = document.querySelector(
  '.font-selection-button-text',
);
const fontOptionsMenu = document.querySelector('.font-options-menu');
const fontOptions = document.querySelectorAll('.font-options p');

const lineDivider = document.querySelector('.line-divider');

const inputContainer = document.querySelector('.input-container');
const inputField = document.querySelector('.input-field');
const searchButton = document.querySelector('.search-button');

function runDictionaryWebApp() {
  performSearch();
  handleThemeSwitch();
  initializeFontOptionsMenu();
}

function performSearch() {
  searchButton.addEventListener('click', () => {
    if (inputField.value.trim() !== '') {
      resetUI();
      fetchDictionaryData(inputField.value);
    } else {
      resetUI();
      displayInputError();
    }
  });

  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      if (inputField.value.trim() !== '') {
        resetUI();
        fetchDictionaryData(inputField.value);
      } else {
        resetUI();
        displayInputError();
      }

      inputField.blur();
    }

    if (window.innerWidth <= 768 && event.key === 'ArrowRight') {
      if (inputField.value.trim() !== '') {
        resetUI();
        fetchDictionaryData(inputField.value);
      } else {
        resetUI();
        displayInputError();
      }

      inputField.blur();
    }
  });
}

async function fetchDictionaryData(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    const fetchedData = await response.json();
    console.log(fetchedData);
    processFetchedData(fetchedData);
  } catch (error) {
    console.error('Error fetching dictionary data:', error);
  }
}

function processFetchedData(fetchedData) {
  if (Array.isArray(fetchedData) && fetchedData.length > 0) {
    renderWordDetails(fetchedData[0]);
  } else {
    showNoResultsMessage(fetchedData);
  }
}

function renderWordDetails(wordInfo) {
  displayWordPronounciation(wordInfo);
  displayMeanings(wordInfo);
  displaySourceInfo(wordInfo);
}

function displayWordPronounciation(wordInfo) {
  const sectionElement = document.createElement('section');
  sectionElement.classList.add(
    'pronounciation',
    'flex',
    'justify-between',
    'items-center',
  );

  const divElement = document.createElement('div');
  divElement.classList.add(
    'flex',
    'flex-col',
    'justify-center',
    'items-start',
    'gap-2',
  );

  const wordEntered = renderWordEntered(wordInfo);
  const phoneticsAndAudioFile = renderPhoneticsWithAudio(wordInfo);

  divElement.appendChild(wordEntered);
  divElement.appendChild(phoneticsAndAudioFile.phonetics);

  sectionElement.appendChild(divElement);
  sectionElement.appendChild(phoneticsAndAudioFile.audioIcon);

  mainElement.appendChild(sectionElement);
}

function renderWordEntered(wordInfo) {
  const wordEntered = document.createElement('h1');
  wordEntered.textContent = wordInfo.word;
  wordEntered.classList.add(
    'font-bold',
    'text-3xl',
    'leading-[2.438rem]',
    'tablet:text-4xl',
    'tablet:leading-[4.844rem]',
  );

  return wordEntered;
}

function renderPhoneticsWithAudio(wordInfo) {
  const phonetics = getPhonetics(wordInfo);
  const audioURL = getAudioFile(wordInfo);
  const audioIcon = buildAudioIcon(audioURL);

  return { phonetics, audioIcon };
}

function getPhonetics(wordInfo) {
  const pronounciation = fetchPronounciationData(wordInfo);
  const phonetics = document.createElement('p');
  phonetics.classList.add(
    'font-regular',
    'text-lg',
    'text-violet',
    'tablet:text-2xl',
    'tablet-leading-[1.813rem]',
  );

  if (pronounciation.usData) {
    phonetics.textContent = pronounciation.usData.text;
  } else if (pronounciation.ukData) {
    phonetics.textContent = pronounciation.ukData.text;
  } else if (phonetics.textContent.trim() === '') {
    setNoPhoneticsMessage(phonetics);
  }

  return phonetics;
}

function setNoPhoneticsMessage(phonetics) {
  phonetics.textContent = 'No Phonetics Available';
  phonetics.classList.remove('font-regular', 'text-lg', 'tablet:text-2xl');
  phonetics.classList.add('font-bold', 'italic', 'text-xs', 'tablet:text-base');
}

function getAudioFile(wordInfo) {
  const pronounciation = fetchPronounciationData(wordInfo);
  let audioURL;
  if (pronounciation.usData) {
    audioURL = pronounciation.usData.audio;
  } else if (pronounciation.ukData) {
    audioURL = pronounciation.ukData.audio;
  }

  return audioURL;
}

function buildAudioIcon(audioURL) {
  const audioIcon = document.createElement('div');
  audioIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 75 75" class="icon-play-hoverEffects tablet:w-[75px] tablet:h-[75px]"><g fill="#A445ED" fill-rule="evenodd"><circle cx="37.5" cy="37.5" r="37.5" opacity=".25"/><path d="M29 27v21l21-10.5z"/></g></svg>`;

  if (!audioURL) {
    removePlayHoverEffects(audioIcon);
  } else {
    audioIcon.addEventListener('click', () => {
      const audioElement = new Audio(audioURL);
      audioElement.play();
    });
  }

  return audioIcon;
}

function removePlayHoverEffects(audioIcon) {
  const audioIconSvg = audioIcon.querySelector('.icon-play-hoverEffects');
  audioIconSvg.classList.remove('icon-play-hoverEffects');
}

function fetchPronounciationData(wordInfo) {
  const usData = wordInfo.phonetics.find(
    (object) => object.audio && object.audio.includes('us'),
  );
  const ukData = wordInfo.phonetics.find(
    (object) => object.audio && object.audio.includes('uk'),
  );

  return { usData, ukData };
}

function displayMeanings(wordInfo) {
  wordInfo.meanings.forEach((object) => {
    const sectionElement = document.createElement('section');
    sectionElement.classList.add(
      'flex',
      'flex-col',
      'gap-6',
      'meanings',
      'tablet:gap-10',
    );

    const divElement1 = document.createElement('div');
    divElement1.classList.add('flex', 'items-center', 'gap-5');
    const divElement2 = document.createElement('div');
    divElement2.classList.add(
      'flex',
      'flex-col',
      'gap-[1.063rem]',
      'tablet:gap-[1.563rem]',
    );

    const partOfSpeech = renderPartOfSpeech(object);
    const lineDivider = document.createElement('p');
    lineDivider.classList.add('h-[1px]', 'w-[100%]', 'bg-lightGray');

    divElement1.appendChild(partOfSpeech);
    divElement1.appendChild(lineDivider);

    const heading = createDefinitionHeading();
    const definitions = renderDefinitions(object);

    divElement2.appendChild(heading);
    divElement2.appendChild(definitions);

    sectionElement.appendChild(divElement1);
    sectionElement.appendChild(divElement2);

    if (object.partOfSpeech === 'noun') {
      const synonyms = renderNounSynonyms(object);
      sectionElement.appendChild(synonyms);
    }

    mainElement.appendChild(sectionElement);
  });
}

function renderPartOfSpeech(object) {
  const partOfSpeech = document.createElement('h2');
  partOfSpeech.textContent = object.partOfSpeech;
  partOfSpeech.classList.add(
    'my-2',
    'text-lg',
    'font-bold',
    'leading-[1.375rem]',
    'italic',
    'tablet:text-2xl',
    'tablet-leading-[1.813rem]',
    'tablet:my-0',
  );

  return partOfSpeech;
}

function createDefinitionHeading() {
  const heading = document.createElement('p');
  heading.classList.add(
    'text-base',
    'leading-[1.188rem]',
    'text-gray',
    'tablet:text-xl',
    'tablet-leading-6',
  );
  heading.textContent = 'Meaning';

  return heading;
}

function renderDefinitions(object) {
  const definitions = document.createElement('ul');
  definitions.classList.add(
    'flex',
    'flex-col',
    'gap-[0.813rem]',
    'justify-center',
  );

  object.definitions.forEach((definitionEntry) => {
    const listElement = document.createElement('li');
    listElement.classList.add(
      'flex',
      'gap-5',
      'custom-marker',
      'tablet:ml-[1.125rem]',
    );

    const divElement = document.createElement('div');
    divElement.classList.add(
      'flex',
      'flex-col',
      'gap-[0.813rem]',
      'justify-center',
      'text-sm',
      'leading-6',
      'tablet:text-lg',
      'tablet:leading-6',
    );

    const definition = document.createElement('p');
    definition.textContent = definitionEntry.definition;

    divElement.appendChild(definition);

    if (object.partOfSpeech === 'verb' && definitionEntry.example) {
      const verbExamples = renderVerbExamples(definitionEntry);
      divElement.appendChild(verbExamples);
    }

    listElement.appendChild(divElement);
    definitions.appendChild(listElement);
  });
  return definitions;
}

function renderNounSynonyms(object) {
  const divElement = document.createElement('div');
  divElement.classList.add('flex', 'items-center', 'gap-6');

  const definitionsHeading = createSynonymsHeading();
  const synonyms = fetchSynonyms(object);

  divElement.appendChild(definitionsHeading);
  divElement.appendChild(synonyms);
  return divElement;
}

function createSynonymsHeading() {
  const heading = document.createElement('h3');
  heading.textContent = 'Synonyms';
  heading.classList.add(
    'text-gray',
    'text-base',
    'leading-[1.188rem]',
    'text-gray',
    'tablet:text-xl',
    'tablet:leading-6',
  );

  return heading;
}

function fetchSynonyms(object) {
  const synonymsHolder = document.createElement('div');
  synonymsHolder.classList.add('flex', 'flex-wrap', 'gap-4');

  const createParagraph = (text) => {
    const p = document.createElement('p');
    p.classList.add(
      'text-base',
      'font-bold',
      'leading-[1.188rem]',
      'text-violet',
      'tablet:text-xl',
      'tablet:leading-6',
    );
    p.textContent = text;
    return p;
  };

  if (object.synonyms.length === 0) {
    synonymsHolder.appendChild(createParagraph('No synonyms available'));
  } else {
    object.synonyms.forEach((synonym) => {
      synonymsHolder.appendChild(createParagraph(`${synonym}`));
    });
  }

  return synonymsHolder;
}

function renderVerbExamples(definitionEntry) {
  const verbExample = document.createElement('p');
  verbExample.textContent = `"${definitionEntry.example}"`;
  verbExample.classList.add('font-sm', 'text-gray', 'leading-6');
  return verbExample;
}

function displaySourceInfo(wordInfo) {
  const sectionElement = document.createElement('section');
  sectionElement.classList.add('source', 'mt-2', 'break-all');

  const lineDivider = document.createElement('p');
  lineDivider.classList.add(
    'line-section',
    'h-[1px]',
    'w-[100%]',
    'bg-lightGray',
    'mb-6',
    'tablet:mb-5',
  );

  const divElement = document.createElement('div');

  const heading = document.createElement('h3');
  heading.textContent = 'Source';
  heading.classList.add(
    'text-xs',
    'leading-[1.063rem]',
    'text-gray',
    'underline',
    'mb-2',
    'tablet:inline-block',
    'tablet:mb-0',
    'tablet:mr-5',
  );

  const sourceURLHolder = renderSourceURL(wordInfo);

  divElement.appendChild(heading);
  divElement.appendChild(sourceURLHolder);

  sectionElement.appendChild(lineDivider);
  sectionElement.appendChild(divElement);

  mainElement.appendChild(sectionElement);
}

function renderSourceURL(wordInfo) {
  const sourceURLHolder = document.createElement('div');
  sourceURLHolder.classList.add('tablet:inline-block');

  const sourceURL = document.createElement('a');
  sourceURL.classList.add(
    'text-xs',
    'leading-[1.056rem]',
    'inline-block',
    'mr-[0.563rem]',
    'underline',
  );
  sourceURL.href = wordInfo.sourceUrls;
  sourceURL.target = '_blank';
  sourceURL.textContent = wordInfo.sourceUrls;

  const sourceURLIcon = document.createElement('a');
  sourceURLIcon.href = wordInfo.sourceUrls;
  sourceURLIcon.target = '_blank';

  const logo = document.createElement('img');
  logo.src = 'images/icon-new-window.svg';
  logo.classList.add('inline-block');

  sourceURLIcon.appendChild(logo);
  sourceURLHolder.appendChild(sourceURL);
  sourceURLHolder.appendChild(sourceURLIcon);

  return sourceURLHolder;
}

function showNoResultsMessage(noDataInfo) {
  const sectionElement = document.createElement('section');
  sectionElement.classList.add(
    'no-data',
    'flex',
    'flex-col',
    'items-center',
    'gap-6',
    'mt-[8.25rem]',
  );

  const emoji = document.createElement('p');
  emoji.textContent = '😕';
  emoji.classList.add('text-6xl');

  const heading = document.createElement('p');
  heading.textContent = noDataInfo.title;
  heading.classList.add(
    'font-xl',
    'leading-6',
    'font-bold',
    'text-charcoal',
    'mt-5',
  );

  const divElement = document.createElement('div');
  divElement.classList.add('font-lg', 'leading-6', 'text-gray', 'text-center');

  const description = document.createElement('p');
  description.classList.add('inline');
  description.textContent = noDataInfo.message;
  divElement.appendChild(description);

  const resolution = document.createElement('p');
  resolution.textContent = noDataInfo.resolution;
  resolution.classList.add('inline');
  divElement.appendChild(resolution);

  sectionElement.appendChild(emoji);
  sectionElement.appendChild(heading);
  sectionElement.appendChild(divElement);
  mainElement.appendChild(sectionElement);
}

function clearPreviousResults() {
  const wordPronounciationSection = document.querySelector('.pronounciation');
  const meaningsSection = document.querySelectorAll('.meanings');
  const sourceSection = document.querySelector('.source');
  const noDataMessageSection = document.querySelector('.no-data');

  if (wordPronounciationSection) {
    mainElement.removeChild(wordPronounciationSection);
  }

  meaningsSection.forEach((meaning) => {
    mainElement.removeChild(meaning);
  });

  if (sourceSection) {
    mainElement.removeChild(sourceSection);
  }

  if (noDataMessageSection) {
    mainElement.removeChild(noDataMessageSection);
  }
}

function handleThemeSwitch() {
  themeSwitch.addEventListener('click', () => {
    updateSwitchStyles();
    updateThemeIconAndLogoColors();
    toggleTheme();
  });
}

function updateSwitchStyles() {
  themeSwitch.classList.toggle('bg-gray');
  themeSwitch.classList.toggle('justify-start');
  themeSwitch.classList.toggle('bg-violet');
  themeSwitch.classList.toggle('justify-end');
}

function updateThemeIconAndLogoColors() {
  themeIcon.setAttribute('stroke', '#A445ED');

  dictionaryAppLogoPaths.forEach((path) =>
    path.setAttribute('stroke', '#A445ED'),
  );

  if (themeSwitch.classList.contains('bg-gray')) {
    themeIcon.setAttribute('stroke', '#838383');
    dictionaryAppLogoPaths.forEach((path) =>
      path.setAttribute('stroke', '#838383'),
    );
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}

function initializeFontOptionsMenu() {
  fontSelectionButton.addEventListener('mouseenter', () => {
    toggleFontOptionsMenuVisibilty(true);
  });

  attachFontOptionsMenuHideEvents();
  handleFontSelection();
}

function attachFontOptionsMenuHideEvents() {
  headerElement.addEventListener('mouseleave', () => {
    toggleFontOptionsMenuVisibilty(false);
  });

  dictionaryAppLogo.addEventListener('mouseenter', () => {
    toggleFontOptionsMenuVisibilty(false);
  });

  fontOptionsMenu.addEventListener('mouseleave', () => {
    toggleFontOptionsMenuVisibilty(false);
  });

  lineDivider.addEventListener('mouseenter', () => {
    toggleFontOptionsMenuVisibilty(false);
  });
}

function toggleFontOptionsMenuVisibilty(isVisible) {
  if (isVisible) {
    fontOptionsMenu.classList.remove('hidden');
    fontOptionsMenu.classList.add('block');
  } else {
    fontOptionsMenu.classList.add('hidden');
    fontOptionsMenu.classList.remove('block');
  }
}

function handleFontSelection() {
  fontOptions.forEach((font) =>
    font.addEventListener('click', () => {
      toggleFontOptionsMenuVisibilty(false);
      fontSelectionButtonText.textContent = font.textContent;
      applySelectedFont();

      function applySelectedFont() {
        bodyElement.classList.remove(
          'font-sansSerif',
          'font-serif',
          'font-mono',
        );

        bodyElement.classList.add(`font-${font.dataset.font}`);
      }
    }),
  );
}

function setInputErrorStyle() {
  inputContainer.classList.remove(
    'border-offWhite',
    'hover:border-violet',
    'dark:hover:border-violet',
  );
  inputContainer.classList.add('border-vividRed', 'dark:border-vividRed');
}

function resetInputFieldStyle() {
  inputContainer.classList.add(
    'border-offWhite',
    'hover:border-violet',
    'dark:hover:border-violet',
  );
  inputContainer.classList.remove('border-vividRed', 'dark:border-vividRed');
}

function showEmptyInputAlert() {
  const sectionElement = document.createElement('section');
  sectionElement.classList.add('alert-msg');

  const alertMessage = document.createElement('p');
  alertMessage.classList.add('text-vividRed', 'leading-6', 'text-xl');
  alertMessage.textContent = 'Whoops, can’t be empty…';

  toggleMainElementSpacing();
  sectionElement.appendChild(alertMessage);
  mainElement.appendChild(sectionElement);
}

function removeEmptyInputAlert() {
  const alertMessage = document.querySelector('.alert-msg');
  if (alertMessage) {
    mainElement.removeChild(alertMessage);
    toggleMainElementSpacing();
  }
}

function toggleMainElementSpacing() {
  mainElement.classList.toggle('gap-6');
  mainElement.classList.toggle('tablet:gap-10');
  mainElement.classList.toggle('gap-2');
  mainElement.classList.toggle('tablet:gap-2');
}

function displayInputError() {
  setInputErrorStyle();
  showEmptyInputAlert();
}

function resetUI() {
  removeEmptyInputAlert();
  resetInputFieldStyle();
  clearPreviousResults();
}

runDictionaryWebApp();
