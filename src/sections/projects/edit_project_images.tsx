import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL, PROJECT_PIC_URL, PROJECT_URL } from '@/config/routes';
import patchHandler from '@/handlers/patch_handler';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { HackathonTeam, Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { resizeImage } from '@/utils/resize_image';
import Image from 'next/image';
import postHandler from '@/handlers/post_handler';
import { X } from '@phosphor-icons/react';

interface Props {
  project: Project;
  setTeam: React.Dispatch<React.SetStateAction<HackathonTeam | null>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProjectImages = ({ project, setTeam, isDialogOpen, setIsDialogOpen }: Props) => {
  const [newImage, setNewImage] = useState<File>();
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [images, setImages] = useState<string[]>(project.images || []);

  const [stage, setStage] = useState(0);
  const [mutex, setMutex] = useState(false);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const handleAddNewImage = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing your project...');

    const formData = new FormData();
    if (newImage) formData.append('image', newImage);

    const URL = `${PROJECT_URL}/image/${project.slug}`;

    const res = await postHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 200) {
      const newProject = res.data.project;

      if (setTeam) {
        setTeam(prev => {
          return prev
            ? {
                ...prev,
                project: { ...(prev.project || newProject), images: newProject.images, hashes: newProject.hashes },
              }
            : prev;
        });
      }

      setNewImage(undefined);
      setNewImageUrl('');

      Toaster.stopLoad(toaster, 'New Project Image Added', 1);
    } else if (res.statusCode == 413) Toaster.stopLoad(toaster, 'Image too large', 0);
    else Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);

    setMutex(false);
  };

  const handleRemoveImage = async (image: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing your project...');

    const formData = { image };

    const URL = `${PROJECT_URL}/image/${project.slug}`;

    const res = await patchHandler(URL, formData);

    if (res.statusCode === 200) {
      const newProject = res.data.project;

      if (setTeam) {
        setTeam(prev => {
          return prev
            ? {
                ...prev,
                project: { ...(prev.project || newProject), images: newProject.images, hashes: newProject.hashes },
              }
            : prev;
        });
      }

      Toaster.stopLoad(toaster, 'Project Image Delete', 1);
    } else if (res.statusCode == 413) Toaster.stopLoad(toaster, 'Image too large', 0);
    else Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);

    setMutex(false);
  };

  const handleRearrangeImages = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing your project...');

    const URL = `${PROJECT_URL}/image/rearrange/${project.slug}`;

    const res = await patchHandler(URL, { images });

    if (res.statusCode === 200) {
      const newProject = res.data.project;

      if (setTeam) {
        setTeam(prev => {
          return prev
            ? {
                ...prev,
                project: { ...(prev.project || newProject), images: newProject.images, hashes: newProject.hashes },
              }
            : prev;
        });
      }

      setStage(0);
      Toaster.stopLoad(toaster, 'Project Edited', 1);
    } else if (res.statusCode == 413) Toaster.stopLoad(toaster, 'Image too large', 0);
    else Toaster.stopLoad(toaster, res.data.message || SERVER_ERROR, 0);

    setMutex(false);
  };

  // const onDragEnd = (result: DropResult) => {
  //   if (!result.destination) return;

  //   const newItems = [...images];
  //   const [removed] = newItems.splice(result.source.index, 1);
  //   newItems.splice(result.destination.index, 0, removed);
  //   setImages(newItems);
  // };

  useEffect(() => {
    setImages(project.images || []);
  }, [project]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className={`sm:max-w-md ${stage == 0 ? 'min-w-[50%] px-16' : 'min-w-[30%]'} overflow-x-hidden`}>
        <DialogHeader>
          <DialogTitle className="text-3xl">Edit Project Images</DialogTitle>
        </DialogHeader>
        {stage == 0 ? (
          <Carousel
            opts={{
              align: 'center',
            }}
          >
            <CarouselContent>
              {project.images &&
                project.images.map((image, index) => {
                  let imageHash = 'no-hash';
                  if (project.hashes && index < project.hashes.length) imageHash = project.hashes[index];

                  return (
                    <CarouselItem key={image} className="w-full h-fit rounded-lg flex items-center justify-center gap-2 group relative">
                      <X
                        onClick={() => handleRemoveImage(image)}
                        className="w-8 h-8 p-2 rounded-full absolute top-2 right-2 flex-center z-10 group-hover:bg-[#ffffff4e] opacity-0 group-hover:opacity-100 transition-ease-300 cursor-pointer"
                      />
                      <Image
                        crossOrigin="anonymous"
                        width={430}
                        height={270}
                        className="w-full rounded-lg"
                        alt={'Project Pic'}
                        src={`${PROJECT_PIC_URL}/${image}`}
                        placeholder="blur"
                        blurDataURL={imageHash}
                      />
                    </CarouselItem>
                  );
                })}

              {!(project.images && project.images.length >= 5) && (
                <CarouselItem className="w-full rounded-lg">
                  {newImageUrl ? (
                    <div className="w-full relative">
                      <div className="w-full h-full absolute top-0 right-0 flex text-lg font-medium z-10">
                        <div
                          onClick={handleAddNewImage}
                          className="w-1/2 h-full flex-center hover:bg-[#7fb06e4e] opacity-0 hover:opacity-100 rounded-l-lg transition-ease-300 cursor-pointer"
                        >
                          Confirm
                        </div>
                        <div
                          onClick={() => {
                            setNewImage(undefined);
                            setNewImageUrl('');
                          }}
                          className="w-1/2 h-full flex-center hover:bg-[#9960604e] opacity-0 hover:opacity-100 rounded-r-lg transition-ease-300 cursor-pointer"
                        >
                          Discard
                        </div>
                      </div>
                      <Image
                        crossOrigin="anonymous"
                        width={1920}
                        height={1080}
                        alt="project cover"
                        src={newImageUrl}
                        className="w-full h-full rounded-lg border-2 border-white border-dashed"
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        className="hidden"
                        id="image"
                        multiple={false}
                        onChange={async ({ target }) => {
                          if (target.files && target.files.length > 0) {
                            if (target.files[0].type.split('/')[0] === 'image') {
                              try {
                                const resizedPic = await resizeImage(target.files[0], 1280, 720);
                                setNewImageUrl(URL.createObjectURL(resizedPic));
                                setNewImage(resizedPic);
                              } catch (error) {
                                console.error('Error while resizing image:', error);
                                return null;
                              }
                            } else {
                              Toaster.error('Only Images allowed');
                              return null;
                            }
                          }
                        }}
                      />
                      <label
                        className="w-full h-80 hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_hover rounded-md flex-center cursor-pointer transition-ease-300"
                        htmlFor="image"
                      >
                        Click Here to Add Picture
                      </label>
                    </div>
                  )}
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          // <DragDropContext onDragEnd={onDragEnd}>
          //   <Droppable droppableId="droppable">
          //     {provided => (
          //       <div {...provided.droppableProps} ref={provided.innerRef} className="w-full flex flex-col gap-4">
          //         {images.map((image, index) => {
          //           let imageHash = 'no-hash';
          //           if (project.hashes && index < project.hashes.length) imageHash = project.hashes[index];
          //           return (
          //             <Draggable key={index} draggableId={index.toString()} index={index}>
          //               {provided => (
          //                 <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          //                   <Image
          //                     crossOrigin="anonymous"
          //                     width={430}
          //                     height={270}
          //                     className="w-full rounded-lg"
          //                     alt={'Project Pic'}
          //                     src={`${PROJECT_PIC_URL}/${image}`}
          //                     placeholder="blur"
          //                     blurDataURL={imageHash}
          //                   />
          //                 </div>
          //               )}
          //             </Draggable>
          //           );
          //         })}
          //         {provided.placeholder}
          //       </div>
          //     )}
          //   </Droppable>
          // </DragDropContext>
          <></>
        )}
        {/* {images.length > 1 && (
          <Button
            onClick={() => {
              if (stage == 0) setStage(1);
              else handleRearrangeImages();
            }}
            className="dark:bg-dark_primary_comp_hover dark:hover:bg-dark_primary_comp_active"
          >
            {stage == 0 ? 'Rearrange Photos' : 'Submit'}
          </Button>
        )} */}
        {stage == 1 && (
          <Button onClick={() => setStage(0)} className="dark:bg-dark_primary_comp_hover dark:hover:bg-dark_primary_comp_active">
            Cancel
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectImages;
