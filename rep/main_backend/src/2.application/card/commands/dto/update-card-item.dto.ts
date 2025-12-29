

export type UpdateCardItemDto = {
  item_id : string;
  x? : number;
  y? : number;
  width? : number;
  height? : number | null;
  rotation? : number;
  scale_x? : number;
  scale_y?: number;
  opacity?: number | null;
  z_index?: number | null;
  is_locked?: boolean | null;
  is_visible?: boolean | null;
  name?: string | null;
  option? : Record<string, any>;
};