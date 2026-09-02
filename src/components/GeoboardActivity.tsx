import React from 'react';
import { GeoboardShapeDrawingGame, GeoboardShapeDrawingGameProps } from './GeoboardShapeDrawingGame';

export type GeoboardActivityProps = GeoboardShapeDrawingGameProps;

export const GeoboardActivity: React.FC<GeoboardActivityProps> = (props) => {
  return <GeoboardShapeDrawingGame {...props} />;
};

export default GeoboardActivity;
export { GeoboardShapeDrawingGame };
