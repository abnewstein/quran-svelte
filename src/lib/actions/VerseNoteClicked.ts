export const VerseNoteClicked = (node: HTMLElement, _options = {}) => {        

    const handleNoteClick = (event: Event) => {
        event.preventDefault();
        console.log('handleNoteClick', event.target);
        const target = event.target as HTMLElement;
    }

    const verseNotesElements = node.querySelectorAll('a[class*=verse-note-link]');
    for (const verseNotesElement of verseNotesElements) {
        verseNotesElement.addEventListener('click', handleNoteClick);
    }
    console.log(verseNotesElements)
    return {
        destroy()  {
            console.log('destroy VerseNote')
            for(const verseNotesElement of verseNotesElements) {
                verseNotesElement.removeEventListener('click', handleNoteClick)
            }
        }
    }
};
