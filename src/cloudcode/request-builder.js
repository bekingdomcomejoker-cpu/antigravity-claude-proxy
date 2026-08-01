export function buildCloudCodeRequest(googleBody, model, token) {
  return {
    model,
    ...googleBody,
    // Cloud Code specific wrapping
  };
}
