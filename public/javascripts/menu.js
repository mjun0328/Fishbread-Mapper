const logout = async () => {
  await fetch(`/api/account/logout`, {
    method: "POST",
  });
  location.reload();
};
