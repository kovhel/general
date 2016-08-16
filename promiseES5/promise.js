var Promise = function (executor) {
    var states = {
        PENDING: 'PENDING',
        FULFILLED: 'FULFILLED',
        REJECTED: 'REJECTED'
    };
    var state = states.PENDING;
    var fulfilledHandlers = [];
    var rejectHandlers = [];
    var resolveValue;
    var rejectReason;

    function resolve(value) {
        if (state === states.PENDING) {
            state = states.FULFILLED;
            resolveValue = value;
            for(var i = 0; i < fulfilledHandlers.length; ++i) {
                fulfilledHandlers[i].call(undefined, value);
                fulfilledHandlers.splice(i, 1);
                --i;
            }
        } else {
            console.warn("Cannot resolve promise in state " + state);
        }
    }

    function reject(reasone) {
        if (state === states.PENDING) {
            state = states.REJECTED;
            rejectReason = reasone;
            for(var i = 0; i < rejectHandlers.length; ++i) {
                rejectHandlers[i].call(undefined, reasone);
                rejectHandlers.splice(i, 1);
                --i;
            }
        } else {
            console.warn("Cannot reject promise in state " + state);
        }
    }

    this.then = function(onFulfilled, onRejected) {
        if(typeof onFulfilled === 'function') {
            switch (state) {
                case states.PENDING:
                    fulfilledHandlers.push(onFulfilled);
                    break;
                case states.FULFILLED:
                    onFulfilled.call(undefined, resolveValue);
                    break;
                default:
                    break;
            }
        }
        this.catch(onRejected);
        return this;
    };

    this.catch = function(onRejected) {
        if(typeof onRejected === 'function') {
            switch (state) {
                case states.PENDING:
                    rejectHandlers.push(onRejected);
                    break;
                case states.REJECTED:
                    onRejected.call(undefined, rejectReason);
                    break;
                default:
                    break;
            }
        }
        return this;
    };

    if( typeof executor === 'object') {
        executor.resolve = resolve;
        executor.reject = reject;
    } else if (typeof executor === 'function') {
        executor.call(executor, resolve, reject);
    }
};
