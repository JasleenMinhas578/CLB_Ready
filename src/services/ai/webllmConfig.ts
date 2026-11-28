import { prebuiltAppConfig, type AppConfig } from '@mlc-ai/web-llm';
import { WEBLLM_LIBS_SHA, WEBLLM_MODEL_SHAS } from '@/services/modelPins';

const LIBS_MAIN = '/mlc-ai/binary-mlc-llm-libs/main/';

/**
 * WebLLM's built-in list downloads from each repo's moving `main` branch.
 * Keep only the models we use, pinned to exact commits.
 * Imported by the worker only: anything that imports WebLLM pulls in the whole 6 MB library.
 */
export const pinnedAppConfig: AppConfig = {
  ...prebuiltAppConfig,
  model_list: prebuiltAppConfig.model_list
    .filter((model) => model.model_id in WEBLLM_MODEL_SHAS)
    .map((model) => {
      if (!model.model_lib.includes(LIBS_MAIN)) throw new Error(`Can't pin the WebLLM library for ${model.model_id}.`);
      return {
        ...model,
        // An explicit /resolve/<sha>/ is kept as is by WebLLM (it only adds /resolve/main/ when missing).
        model: `https://huggingface.co/mlc-ai/${model.model_id}/resolve/${WEBLLM_MODEL_SHAS[model.model_id]}/`,
        model_lib: model.model_lib.replace(LIBS_MAIN, `/mlc-ai/binary-mlc-llm-libs/${WEBLLM_LIBS_SHA}/`),
      };
    }),
};
