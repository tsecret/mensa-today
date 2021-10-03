import Lottie from 'react-lottie';
import { loading } from '../assets';

const Loading = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: loading,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Lottie
            options={defaultOptions}
            style={{ marginTop: 100 }}
            height={200}
            width={200}
        />
    )
}

export default Loading;
