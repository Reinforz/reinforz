import { DropzoneRootProps, useDropzone } from 'react-dropzone';

const getColor = (props: DropzoneRootProps) => {
  if (props?.isDragAccept) return '#00e676';
  if (props?.isDragReject) return '#ff1744';
  if (props?.isDragActive) return '#2196f3';
  return '#404040';
};

interface Options<F = any, P = any> {
  onAbortMessage?: string;
  onErrorMessage?: string;
  onLoad: (
    reader: FileReader,
    file: File,
    resolve: (value: P | PromiseLike<P>) => void,
    items: P[]
  ) => any;
  onResolved: (currentItems: F[], newItems: P[]) => F[];
  items: F[];
  setItems: React.Dispatch<React.SetStateAction<F[]>>;
}

export const useUpload = <F = any, P = any>(options: Options<F, P>) => {
  const { items, setItems } = options;

  const onDrop = (acceptedFiles: any) => {
    const filePromises: Promise<P>[] = [];

    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      filePromises.push(
        new Promise((resolve, reject) => {
          reader.onabort = () =>
            reject(options.onAbortMessage ?? 'file reading was aborted');
          reader.onerror = () =>
            reject(options.onErrorMessage ?? 'file reading has failed');
          reader.onload = () =>
            options.onLoad(reader, file, resolve, items as any);
        })
      );
      reader.readAsText(file);
    });

    Promise.all(filePromises).then((newItems) => {
      setItems(options.onResolved(items, newItems));
    });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop, accept: ['.yml', '.yaml', 'application/json'] });
  const rootProps = getRootProps({ isDragActive, isDragAccept, isDragReject }),
    borderColor = getColor(rootProps);

  return {
    rootProps,
    getInputProps,
    getRootProps,
    items,
    setItems,
    borderColor,
    isDragActive
  };
};
