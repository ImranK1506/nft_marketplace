import { useState, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { NFTContext } from '../../context/NFTContext';
import { Button } from '../components';
import images from '../../assets';
import { Input } from '../components';

const CreateNft = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({ price: '0.25', name: '', description: '' });
  const { uploadToIPFS, createNFT } = useContext(NFTContext);
  const router = useRouter();

  const { theme } = useTheme();

  const onDrop = useCallback(async (acceptedFile) => {
    // Upload image to ipfs
    const url = await uploadToIPFS(acceptedFile[0]);

    console.log({ url });
    setFileUrl(url);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (
    `
      dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
      ${isDragActive && 'border-file-active'}
      ${isDragAccept && 'border-file-accept'}
      ${isDragReject && 'border-file-reject'}
    `
  ), []);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-0 xs:ml-0">Create NFT</h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">Upload file</p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col tex-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBM, Max 100mb
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    styles="containe"
                    alt="file_upload"
                    className={theme === 'light' ? 'filter invert' : undefined}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  Or browse media on your device
                </p>
              </div>
            </div>
            {fileUrl && (
              <asside>
                <div>
                  <img src={fileUrl} alt="asset_file" />
                </div>
              </asside>
            )}
          </div>
        </div>
        {/* Input */}
        <Input
          inputType="input"
          title="Name"
          placeholder="NFT Name"
          handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="NFT Description"
          handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={() => {}}
        />
        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create NFT"
            handleClick={() => createNFT(formInput, fileUrl, router)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNft;
