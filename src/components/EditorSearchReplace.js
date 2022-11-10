import React from "react";
import SearchReplace from "./SearchReplaceWrapper";
import PropTypes from "prop-types";
import EpiteleteHtml from "epitelete-html";

export default function EditorSearchReplace({
  epiteleteHtml,
  bookCode,
  onReplace: _onReplace,
}) {

  if (!epiteleteHtml) return <></>;

  const buildResults = (results, sourceKey) => {
    return results.map((result) => ({
      ...result,
      key: result.pointer,
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
    const { isRegex = true } = options;
    const data = {
      perf: {},
      params: {
        target,
        replacement,
        pointers: resultsKeys,
        config: { isRegex },
      },
    };
    const report = await epiteleteHtml.makeDocumentReport(
      bookCode,
      "searchReplace",
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
    return buildResults(results, sourceKey);
  };

  const searchReplaceProps = {
    metadata: {
      hoverText: `${epiteleteHtml.docSetId} - ${bookCode}`,
      title: `${epiteleteHtml.docSetId} - ${bookCode}`,
    },
    sourcesKeys: epiteleteHtml ? [epiteleteHtml.docSetId] : [],
    onReplace,
    onSearch,
  };
  return <SearchReplace {...searchReplaceProps}></SearchReplace>;
}

EditorSearchReplace.propTypes = {
  epiteleteHtml: PropTypes.instanceOf(EpiteleteHtml),
  bookCode: PropTypes.string,
  onReplace: PropTypes.func,
};
