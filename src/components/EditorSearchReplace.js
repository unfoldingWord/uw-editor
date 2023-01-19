import React from "react";
import PropTypes from "prop-types";
import EpiteleteHtml from "epitelete-html";
import useFindAndReplace from "./useFindAndReplace";
import SearchReplaceUI from "./SearchReplaceUI";

export default function EditorSearchReplace({
  epiteleteHtml,
  bookCode,
  onReplace: _onReplace = () => {},
  onSearch: _onSearch = () => {},
}) {

  const docSetId = epiteleteHtml?.docSetId || ""

  const buildResults = (results, sourceKey) => {
    // console.log({results})
    return results.map((result) => ({
      ...result,
      key: result.resultKey,
      groupKey: sourceKey,
      hoverText: "hover:" + sourceKey,
    }));
  };

  const searchOrReplace = async ({
    target,
    replacement,
    resultsKeys,
    options = {},
  }) => {
    const data = {
      perf: {},
      params: {
        target,
        replacement,
        replacementKeys: resultsKeys,
        config: { ...options, ctxLen: 30 },
      },
    };
    const report = await epiteleteHtml.makeDocumentReport(
      bookCode,
      "findAndReplace",
      data
    );
    return report;
  };

  const onReplace = async ({
    sourceKey,
    target,
    replacement,
    resultsKeys,
    options,
  }) => {
    const { results, perf } = await searchOrReplace({
      target,
      replacement,
      resultsKeys,
      options,
    });
    const sequenceId = perf.main_sequence_id;
    const sequence = perf.sequences[sequenceId];
    await epiteleteHtml.writePerf(bookCode, sequenceId, sequence);
    _onReplace();
    return buildResults(results, sourceKey);
  };

  const onSearch = async ({ sourceKey, target, replacement, options }) => {
    const { results } = await searchOrReplace({
      target,
      replacement,
      options,
    });
    _onSearch();
    return buildResults(results, sourceKey);
  };

  const searchReplaceProps = useFindAndReplace({
    metadata: {
      hoverText: `${docSetId} - ${bookCode}`,
      title: `${docSetId} - ${bookCode}`,
    },
    sourcesKeys: [docSetId],
    onReplace,
    onSearch,
  });

  return <SearchReplaceUI {...searchReplaceProps}></SearchReplaceUI>;
}

EditorSearchReplace.propTypes = {
  epiteleteHtml: PropTypes.instanceOf(EpiteleteHtml),
  bookCode: PropTypes.string,
  onReplace: PropTypes.func,
  onSearch: PropTypes.func,
};
