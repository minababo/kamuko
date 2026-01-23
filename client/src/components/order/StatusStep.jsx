import PropTypes from 'prop-types';

const StatusStep = ({ label, status, timestamp, icon, isLast }) => {
    // status: 'completed', 'current', 'upcoming'

    const getStatusStyles = () => {
        switch (status) {
            case 'completed':
                return {
                    circle: 'bg-green-500 border-green-500',
                    line: 'bg-green-500',
                    text: 'text-gray-900',
                    icon: 'text-white',
                };
            case 'current':
                return {
                    circle: 'bg-orange-500 border-orange-500 animate-pulse',
                    line: 'bg-gray-300',
                    text: 'text-orange-600 font-semibold',
                    icon: 'text-white',
                };
            case 'upcoming':
            default:
                return {
                    circle: 'bg-white border-gray-300',
                    line: 'bg-gray-300',
                    text: 'text-gray-500',
                    icon: 'text-gray-400',
                };
        }
    };

    const styles = getStatusStyles();

    const renderIcon = () => {
        if (status === 'completed') {
            return (
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            );
        }

        if (icon) {
            return <span className={`text-sm ${styles.icon}`}>{icon}</span>;
        }

        return <span className={`h-3 w-3 rounded-full ${status === 'upcoming' ? 'bg-gray-300' : 'bg-white'}`} />;
    };

    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center">
                {/* Circle with icon */}
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${styles.circle}`}
                >
                    {renderIcon()}
                </div>

                {/* Connecting line */}
                {!isLast && (
                    <div className={`mt-1 h-16 w-0.5 transition-all duration-500 ${styles.line}`} />
                )}
            </div>

            {/* Label and timestamp */}
            <div className="ml-4 flex-1 pb-8">
                <p className={`text-base transition-all duration-300 ${styles.text}`}>
                    {label}
                </p>
                {timestamp && (
                    <p className="mt-1 text-sm text-gray-500">
                        {new Date(timestamp).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </p>
                )}
            </div>
        </div>
    );
};

StatusStep.propTypes = {
    label: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['completed', 'current', 'upcoming']).isRequired,
    timestamp: PropTypes.string,
    icon: PropTypes.node,
    isLast: PropTypes.bool,
};

StatusStep.defaultProps = {
    timestamp: null,
    icon: null,
    isLast: false,
};

export default StatusStep;
