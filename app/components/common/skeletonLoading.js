import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonLoading = ({
  height1 = "50",
  height2 = "50",
  height3 = "50",
  height4 = "50",
  height5 = "50",
  width1 = "60%",
  width2 = "70%",
  width3 = "80%",
  width4 = "90%",
  width5 = "100%",
  cols = 3,
}) => {
  return (
    <div className="w-full h-full  animate-pulse travel-container">
      <SkeletonTheme baseColor="#e1e1e1" highlightColor="#f5f5f5">
        {cols === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton height={height1} width={width1} />
                <Skeleton height={height2} width={width2} />
                <Skeleton height={height3} width={width3} />
                <Skeleton height={height4} width={width4} />
                <Skeleton height={height5} width={width5} />
              </div>
            ))}
          </div>
        )}
        {cols === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton height={height1} width={width1} />
                <Skeleton height={height2} width={width2} />
                <Skeleton height={height3} width={width3} />
                <Skeleton height={height4} width={width4} />
                <Skeleton height={height5} width={width5} />
              </div>
            ))}
          </div>
        )}
        {cols === 1 && (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(1)].map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton height={height1} width={width1} />
                <Skeleton height={height2} width={width2} />
                <Skeleton height={height3} width={width3} />
                <Skeleton height={height4} width={width4} />
                <Skeleton height={height5} width={width5} />
              </div>
            ))}
          </div>
        )}
        {cols === 4 && (
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton height={height1} width={width1} />
                <Skeleton height={height2} width={width2} />
                <Skeleton height={height3} width={width3} />
                <Skeleton height={height4} width={width4} />
                <Skeleton height={height5} width={width5} />
              </div>
            ))}
          </div>
        )}
      </SkeletonTheme>
    </div>
  );
};
export default SkeletonLoading;
