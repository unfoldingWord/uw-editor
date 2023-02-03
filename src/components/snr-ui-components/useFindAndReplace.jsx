//* eslint-disable */
import { useState } from "react";
import PropTypes from "prop-types";
import { useDeepCompareEffect } from "use-deep-compare";

export default function useFindAndReplace(props) {
  const {
    sourcesKeys,
    metadata,
    onSearch: _onSearch,
    onReplace: _onReplace,
    onClickGroup,
    onClickResult,
  } = props;
  const [groups, setGroups] = useState({});

  const getResult = async ({ sourceKey, target, replacement, resultsKeys, options }) => {
    const shouldWrite = !(resultsKeys === undefined || resultsKeys === null);
    return shouldWrite
      ? await _onReplace({ target, replacement, sourceKey, resultsKeys, options })
      : await _onSearch({ target, replacement, sourceKey, options });
  };

  const buildGroup = async ({
    sourceKey,
    target,
    replacement,
    resultsKeys,
    options
  }) => {
    const results = await getResult({
      sourceKey,
      target,
      replacement /* config */,
      resultsKeys,
      options
    });
    return {
      key: `${sourceKey}`,
      title: metadata?.title ?? `${sourceKey}`,
      hoverText: metadata?.hoverText ?? `${sourceKey}`,
      results,
      metadata: metadata,
    };
  };

  const getGroups = async ({ target, replacement = "", resultsKeys, options}) => {
    return await sourcesKeys.reduce(async (groups, sourceKey) => {
      const group = await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
        options
      });
      groups[sourceKey] = group;
      return groups;
    }, {});
  };

  const onSearch = async ({ target, replacement = "", options }) => {
    const groups = await getGroups({ target, replacement, options });
    setGroups((prevGroups) => ({ ...prevGroups, ...groups }));
  };

  const onReplaceAll = async ({ target, replacement, groups, options }) => {
    const groupKeys = groups ? Object.keys(groups) : false;
    if (!groupKeys?.length) {
      const newGroups = await getGroups({
        target,
        replacement,
        resultsKeys: "all",
        options,
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
        options
      });
      newGroups[groupKey] = newGroup;
      return newGroups;
    }, {});
    setGroups((prevGroups) => ({ ...prevGroups, ...newGroups }));
  };

  const onReplaceGroup = async ({ target, replacement, group, options }) => {
    const { results, key: sourceKey } = group;
    const resultsKeys = results.map((result) => result.key);
    const _groups = {
      [sourceKey]: await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
        options
      }),
    };
    setGroups((prevGroups) => ({ ...prevGroups, ..._groups, options }));
  };

  const onReplaceResult = async ({ target, replacement, result, options }) => {
    const { key, groupKey: sourceKey } = result;
    const resultsKeys = [key];
    const _groups = {
      [sourceKey]: await buildGroup({
        sourceKey,
        target,
        replacement,
        resultsKeys,
        options
      }),
    };
    setGroups((prevGroups) => ({ ...prevGroups, ..._groups }));
  };

  useDeepCompareEffect(() => {
    console.log("Groups changed");
    console.log({ groups });
  }, [groups]);

  return {
    groups,
    onSearch,
    onClickGroup,
    onClickResult,
    onReplaceAll,
    onReplaceGroup,
    onReplaceResult,
  };
}

useFindAndReplace.propTypes = {
  sourcesKeys: PropTypes.arrayOf(PropTypes.string),
  metadata: PropTypes.objectOf(PropTypes.any),
  onReplace: PropTypes.func,
  onSearch: PropTypes.func,
  onClickGroup: PropTypes.func,
  onClickResult: PropTypes.func,
};
