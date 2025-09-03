import { useCourses } from "@/hooks/useCourses";
import { useSubjectStore } from "@/store/store";
import { Atom, GraduationCap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

const SubjectSelection = () => {
  const { addToCart, item } = useSubjectStore();
  const navigate = useNavigate();
  const { data: courses, isLoading, isError } = useCourses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-5 h-screen">
        <Loader2 className="animate-spin text-4xl" />
        <p className="">Loading courses...</p>
      </div>
    );
  }
  if (isError || !courses) {
    return (
      <div className="flex items-center justify-center py-16 h-screen text-red-700">
        <p className="">Error loading courses</p>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-primary font-medium">Step 1</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Choose Your Subject
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the subject you want to improve in. Our expert tutors are
            ready to help you succeed.
          </p>
        </div>

        {/* Subject Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {courses?.map((subject) => {
            const isSelected = item?.id === subject.id;

            return (
              <div
                key={subject.id}
                className={`subject-card group ${isSelected ? "selected" : ""}`}
                onClick={() => addToCart(subject)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    addToCart(subject);
                  }
                }}
              >
                {/* Popular badge */}
                {subject.popular && (
                  <div className="absolute -top-2 -right-2 bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                  }`}
                >
                  <Atom className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {subject.title.rendered}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Placeat ipsa, nostrum optio, excepturi eum recusandae vitae
                  fugit eveniet eius quis maxime obcaecati itaque! Aliquid dicta
                  modi nisi, accusamus similique asperiores!{" "}
                </p>
              </div>
            );
          })}
        </div>

        {/* Continue button */}
        {item && (
          <div className="text-center mt-12 fade-in-up">
            <button
              className="btn-primary text-lg px-8 py-4"
              onClick={() => {
                navigate("/package");
              }}
            >
              Continue to Package Selection
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubjectSelection;
