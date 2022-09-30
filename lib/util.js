function getParameter(key) {
    // Address of the current window
    address = window.location.search
  
    // Returns a URLSearchParams object instance
    parameterList = new URLSearchParams(address)
  
    // Returning the respected value associated
    // with the provided key
    return parameterList.get(key)
}

function interpolate(p, a, b) {
    return a * (1 - p) + b * p
}