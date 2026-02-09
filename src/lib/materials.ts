export type Material = {
  title: string;
  subject: string;
  class: "s1" | "s2" | "s3" | "s4" | "s5" | "s6";
  type: "pdf" | "notes";
};

export const materials: Material[] = [
  {
    title: "Algebra Notes",
    subject: "mathematics",
    class: "s1",
    type: "pdf"
  },
  {
    title: "Physics Formula Sheet",
    subject: "physics",
    class: "s1",
    type: "pdf"
  },
  {
    title: "Cell Biology Summary",
    subject: "biology",
    class: "s1",
    type: "notes"
  }
];
