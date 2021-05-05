import { OptionsObject, useSnackbar } from "notistack";
import React from 'react';
import { useThemeSettings } from "../../../hooks";
import { useUpload } from "../../../hooks/useUpload";

interface RenderProps<F> {
  component: JSX.Element,
  state: {
    items: F[],
    setItems: React.Dispatch<React.SetStateAction<F[]>>
  }
}
interface Props<F, P> {
  children: (renderProps: RenderProps<F>) => JSX.Element
  notistackOptions?: OptionsObject,
  dragActiveMessage?: string
  dragInActiveMessage?: string
  loadData: (ext: string, result: string | ArrayBuffer) => P
  isDuplicate: (items: P[], loadedData: P) => boolean,
  onResolved: (currentItems: F[], newItems: P[]) => F[]
}

function Upload<F, P>(props: Props<F, P>) {
  const notistackOptions = props.notistackOptions ?? {
    variant: 'error',
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
  };

  const { getRootProps, getInputProps, items, setItems, isDragActive, borderColor } = useUpload<F, P>({
    onLoad: (reader, file, resolve, items) => {
      let dotSplit = file.name.split(".");
      const ext = dotSplit[dotSplit.length - 1];
      const { result } = reader;
      if (result) {
        try {
          const loadedData = props.loadData(ext, result);
          const isDuplicate = props.isDuplicate(items, loadedData);
          if (isDuplicate)
            enqueueSnackbar(`${file.name} has already been added`, notistackOptions);
          else
            resolve(loadedData);
        } catch (err) {
          enqueueSnackbar(`${file.name} Error: ${err.message}`, notistackOptions)
        }
      } else
        enqueueSnackbar(`${file.name} is empty`, notistackOptions);
    },
    onResolved: props.onResolved
  },
  );
  const { theme } = useThemeSettings(), { enqueueSnackbar } = useSnackbar();

  return props.children({
    component: <div {...getRootProps()} style={{ backgroundColor: theme.color.light, color: theme.palette.text.secondary, borderColor }} className="Upload">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>{props.dragActiveMessage ?? 'Drop the files here ...'}</p> :
          <p>{props.dragInActiveMessage ?? `Drag 'n' drop some files here, or click to upload files (.json or .yaml files)`}</p>
      }
    </div>,
    state: {
      items, setItems
    }
  })
}

export { Upload };

