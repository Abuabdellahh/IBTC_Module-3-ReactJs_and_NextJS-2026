export async function POST(request) {
  const body = await request.json();
  const { name, phone } = body;

  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must contain at least 2 characters.";
  }

  if (!phone || !/^(09\d{8}|\+2519\d{8})$/.test(phone.trim())) {
    errors.phone = "Enter a valid Ethiopian phone number (09... or +2519...).";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Validation failed", fieldErrors: errors },
      { status: 422 }
    );
  }

  const order = {
    id: `ord-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    createdAt: new Date().toISOString(),
  };

  return Response.json(order, { status: 201 });
}
