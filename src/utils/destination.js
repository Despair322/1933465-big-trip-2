function getFlags(destination) {
  const hasDescription = destination.description.length > 0;
  const hasPictures = destination.pictures.length > 0;
  const hasDescriptionBlock = hasDescription || hasPictures;

  return {
    hasDescription,
    hasPictures,
    hasDescriptionBlock,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  };
}

function deleteFlags(item) {
  delete item.allOffers;
  delete item.hasDescription;
  delete item.hasPictures;
  delete item.hasOffers;
  delete item.hasDescriptionBlock;
  delete item.isSubmitDisabled;
  delete item.isSaving;
  delete item.isDeleting;
  delete item.isDisabled;
  return item;
}

export { getFlags, deleteFlags };
