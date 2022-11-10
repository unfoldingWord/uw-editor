//* eslint-disable */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDeepCompareEffect } from "use-deep-compare";
import SearchReplaceUI from "./SearchReplaceUI";

export default function SearchReplace(props) {
  const {
    sourcesKeys,
    metadata,
    onSearch: _onSearch,
    onReplace: _onReplace,
    onClickGroup,
    onClickResult,
  } = props;
  const [groups, setGroups] = useState({});

  const getResult = async ({ sourceKey, target, replacement, resultsKeys }) => {
    const shouldWrite = !(resultsKeys === undefined || resultsKeys === null);
    return shouldWrite
      ? await _onReplace({ target, replacement, sourceKey, resultsKeys })
      : await _onSearch({ target, replacement, sourceKey });
  };

  const buildGroup = async ({
    sourceKey,
    target,
    replacement,
    resultsKeys,
  }) => {
    const results = await getResult({
      sourceKey,
      target,
      replacement /* config */,
      resultsKeys,
    });
    return {
      key: `${sourceKey}`,
      title: metadata?.title ?? `${sourceKey}`,
      hoverText: metadata?.hoverText ?? `${sourceKey}`,
      results,
      metadata: metadata,
    };
  };

  const getGroups = async ({ target, replacement = "", resultsKeys }) => {
    return await sourcesKeys.reduce(async (groups, groupKey) => {
      const sourceKey = sourcesKeys[groupKey];
      const group = await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
      });
      groups[groupKey] = group;
      return groups;
    }, {});
  };

  const onSearch = async ({ target, replacement = "" }) => {
    const groups = await getGroups({ target, replacement });
    setGroups((prevGroups) => ({ ...prevGroups, ...groups }));
  };

  const onReplaceAll = async ({ target, replacement, groups }) => {
    const groupKeys = groups ? Object.keys(groups) : false;
    if (!groupKeys?.length) {
      const newGroups = await getGroups({
        target,
        replacement,
        resultsKeys: "all",
      });
      setGroups((prevGroups) => ({ ...prevGroups, ...newGroups }));
      return;
    }
    const newGroups = await groupKeys.reduce(async (newGroups, groupKey) => {
      const group = groups[groupKey];
      const results = group.results;
      const resultsKeys = results.map((result) => result.pointer);
      const newGroup = await buildGroup({
        sourceKey: groupKey,
        target,
        replacement,
        resultsKeys,
      });
      newGroups[groupKey] = newGroup;
      return newGroups;
    }, {});
    setGroups((prevGroups) => ({ ...prevGroups, ...newGroups }));
  };

  const onReplaceGroup = async ({ target, replacement, group }) => {
    const { results, key: sourceKey } = group;
    const resultsKeys = results.map((result) => result.key);
    const _groups = {
      [sourceKey]: await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
      }),
    };
    setGroups((prevGroups) => ({ ...prevGroups, ..._groups }));
  };

  const onReplaceResult = async ({ target, replacement, result }) => {
    const { key, groupKey: sourceKey } = result;
    const resultsKeys = [key];
    const _groups = {
      [sourceKey]: await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
      }),
    };
    setGroups((prevGroups) => ({ ...prevGroups, ..._groups }));
  };

  useDeepCompareEffect(() => {
    console.log("Groups changed");
    console.log({ groups });
  }, [groups]);

  const srProps = {
    groups,
    onSearch,
    onClickGroup,
    onClickResult,
    onReplaceAll,
    onReplaceGroup,
    onReplaceResult,
    config: { isRegex: true },
  };
  return (
    <>
      <SearchReplaceUI {...srProps} />
    </>
  );
}

SearchReplace.propTypes = {
  sourcesKeys: PropTypes.arrayOf(PropTypes.string),
  metadata: PropTypes.objectOf(PropTypes.any),
  onReplace: PropTypes.func,
  onSearch: PropTypes.func,
  onClickGroup: PropTypes.func,
  onClickResult: PropTypes.func,
};
