const groups = [
  {
    hoverText: "unfoldingWord/en_ult",
    pointer: { cardId: "dcs-card-1" },
    metadata: { author: "unfoldingWord", org: "dcs" },
    results: [
      {
        text: "zealous for good works|beneficial acts.",
        hoverText: "Titus 1:15",
        metadata: {
          target: "good works",
          book: "titus",
          author: "unfoldingWord",
          org: "dcs",
          occurrence: 2,
          occurrences: 2,
        },
        pointer: {
          cardId: "dcs-card-1",
          bookCode: "TIT",
          verses: 1,
          chapter: 3,
        },
      },
      {
        text: "about doing good works|beneficial acts, then ",
        hoverText: "Titus 1:15",
        metadata: {
          target: "good works",
          book: "titus",
          author: "unfoldingWord",
          org: "dcs",
          occurrence: 1,
          occurrences: 2,
        },
        pointer: {
          target: "good works",
          cardId: "dcs-card-1",
          bookCode: "TIT",
          verses: 1,
          chapter: 15,
        },
      },
    ],
  },
  {
    hoverText: "door43/en_ust",
    pointer: { cardId: "dcs-card-2" },
    metadata: { author: "door43", org: "dcs" },
    results: [
      {
        text: "that they do is good works|beneficial acts.",
        hoverText: "Titus 1:15",
        metadata: {
          book: "titus",
          author: "door43",
          org: "dcs",
          occurrence: 2,
          occurrences: 2,
        },
        pointer: {
          cardId: "dcs-card-2",
          bookCode: "TIT",
          verses: 1,
          chapter: 3,
        },
      },
    ],
  },
];

const results = [
  {
    text: "zealous for good works|beneficial acts.",
    hoverText: "Titus 1:15",
    metadata: {
      target: "good works",
      book: "titus",
      occurrence: 2,
      occurrences: 2,
    },
    pointer: {
      cardId: "custom-card-3",
      bookCode: "TIT",
      verses: 1,
      chapter: 3,
    },
  },
  {
    text: "about doing good works|beneficial acts, then ",
    hoverText: "Titus 1:15",
    metadata: {
      target: "good works",
      book: "titus",
      occurrence: 1,
      occurrences: 2,
    },
    pointer: {
      target: "good works",
      cardId: "custom-card-2",
      bookCode: "TIT",
      verses: 1,
      chapter: 15,
    },
  },
];

//Pass this over to the component <SearchAndReplace {...props}>
export default {
  results: results,
  groups: groups,
  target: "good works",
  replacement: "beneficial acts",
  onSearch: ({ target }) => console.log(target),
  onClickGroup: ({ pointer, metadata }) => console.log({ pointer, metadata }),
  onClickResult: ({ pointer, metadata }) => console.log({ pointer, metadata }),
  onReplaceAll: ({ results, target, replacement }) =>
    console.log({ results, target, replacement }),
  onReplaceGroup: ({ results, target, replacement }) =>
    console.log({ results, target, replacement }),
  onReplaceResult: ({ result, target, replacement }) =>
    console.log({ result, target, replacement }),
  config: {}
};