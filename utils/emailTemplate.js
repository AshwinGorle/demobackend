const emailTemplate=(details)=>{
    const template=`Dear Student,

    We are pleased to inform you that your request for the book titled ${details.book} has been approved by the librarian. You can now collect the book from the library.
    
    Book Details:
    Title: ${details.book}
    Author:${details.author}
    ISBN: ${details.ISBN}
    Due Date: ${details.dueDate}
    
    Please ensure to return the book by the due date to avoid any late fees or penalties. If you have any questions or concerns, feel free to contact us.
    
    Thank you for using our library services.
    
    Best regards,
    QuickLib`

    return template;
}

module.exports=emailTemplate;

