import FlyingPosters from './FlyingPosters'

const items = [
  'https://picsum.photos/500/500?grayscale', 
  'https://picsum.photos/600/600?grayscale', 
  'https://picsum.photos/400/400?grayscale'
];

const FlyingAction = () => {
  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <FlyingPosters items={items}/>
    </div>
  );
};

export default FlyingAction