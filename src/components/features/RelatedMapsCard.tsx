// RelatedMapsCard.tsx
import React from 'react';

interface RelatedMap {
  map_id: number;
  texture_type: string;
}

interface RelatedMapsDisplayProps {
  relatedMaps: RelatedMap[]; // Array of related maps passed as a prop
}

const RelatedMapsDisplay: React.FC<RelatedMapsDisplayProps> = ({ relatedMaps }) => {
  return (
    <div>
      <h3>Related Maps:</h3>
      {relatedMaps.length > 0 ? (
        <ul>
          {relatedMaps.map((map) => (
            <li key={map.map_id}>
              {map.texture_type}: {map.map_id}
            </li>
          ))}
        </ul>
      ) : (
        <p>No related maps found for this texture.</p>
      )}
    </div>
  );
};

export default RelatedMapsDisplay;
