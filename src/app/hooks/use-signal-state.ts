import { effect, type Signal } from "@preact/signals-core";
import { useEffect, useState } from "react";

export function useSignalState<T>(signal: Signal<T>) {
    const [state, setState] = useState<T>(signal.value);

    useEffect(() => {
        return effect(() => setState(signal.value));
    }, [signal]);

    return state;
}