export default function LibraryLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  {
    return (
      <>
        {modal}
        {children}
      </>
    );
  }
}
