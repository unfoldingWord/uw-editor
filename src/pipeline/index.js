import findrPipeline from "./pipeline"
import findrTransform from "./transform"

export default {
  pipelines: { findAndReplace: findrPipeline },
  transforms: { findAndReplace: findrTransform }
}