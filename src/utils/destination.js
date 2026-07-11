function getFlags(destination) {
  const hasDescription = destination.description.length > 0;
  const hasPictures = destination.pictures.length > 0;
  const hasDescriptionBlock = hasDescription || hasPictures;
  return { hasDescription, hasPictures, hasDescriptionBlock };
}

function deleteFlags(item) {
  delete item.allOffers;
  delete item.hasDescription;
  delete item.hasPictures;
  delete item.hasOffers;
  delete item.hasDescriptionBlock;
  delete item.isSubmitDisabled;
  return item;
}

export { getFlags, deleteFlags };
