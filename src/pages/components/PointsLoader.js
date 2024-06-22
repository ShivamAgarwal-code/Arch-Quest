import Lottie from "react-lottie-player";
import lottieJson from "../../resources/lf20_vmllloul.json";
import React from "react";

const PointsLoader = () => {
    return (
        <div className="my-10 flex bg-light_white justify-center">
            <div className="my-auto">
                <Lottie
                    loop
                    animationData={lottieJson}
                    play
                    style={{width: 150, height: 150}}
                />
            </div>
        </div>
    )
}

export default PointsLoader;