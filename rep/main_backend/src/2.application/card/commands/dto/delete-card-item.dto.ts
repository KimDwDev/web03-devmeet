

type DeleteCardItemIdDto = {
  item_id : string;
};

export type DeleteCardItemDtos = {
  card_id : string;
  item_ids : Array<DeleteCardItemIdDto>;
};